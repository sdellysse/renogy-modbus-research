import * as express from "express";
import * as rt from "runtypes";
import * as db from "./db";

// export for testing
const store = {
  handle: db.getInitialHandle(),
};

const routes = <const>{
  "GET /users": async (
    req: express.Request,
    res: express.Response
  ): Promise<void> => {
    const users = await db.getUsers({ handle: store.handle });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    res.json(users.map(({ followingIds, ...restOfUser }) => restOfUser));
  },

  "GET /users/:id": async (
    req: express.Request,
    res: express.Response
  ): Promise<void> => {
    const Params = rt.Record({
      id: rt.String,
    });

    let params: rt.Static<typeof Params>;
    try {
      params = Params.check(req.params);
    } catch (error) {
      res.sendStatus(400);
      return;
    }

    const user = await db.getUserById({
      handle: store.handle,
      id: params.id,
    });
    if (user === null) {
      res.sendStatus(404);
      return;
    }

    const { followingIds, ...restOfUser } = user;
    const followingUsers = (
      await Promise.all(
        followingIds.map(async (id) => {
          const followingUser = await db.getUserById({
            handle: store.handle,
            id,
          });
          if (followingUser === null) {
            return null;
          }

          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { followingIds, ...restOfUser } = followingUser;
          return restOfUser;
        })
      )
    ).filter((followingUser) => followingUser !== null);

    const json = {
      ...restOfUser,
      following: followingUsers,
    };

    res.json(json);
  },

  "PATCH /users/:id": async (
    req: express.Request,
    res: express.Response
  ): Promise<void> => {
    const ParamsSchema = rt.Record({
      id: rt.String,
    });

    let params: rt.Static<typeof ParamsSchema>;
    try {
      params = ParamsSchema.check(req.params);
    } catch (error) {
      res.sendStatus(400);
      return;
    }

    const BodySchema = rt.Union(
      rt.Record({
        action: rt.Literal("follow"),
        user_id: rt.String,
      }),
      rt.Record({
        action: rt.Literal("unfollow"),
        user_id: rt.String,
      }),
      rt.Record({
        action: rt.Literal("view"),
      })
    );

    let body: rt.Static<typeof BodySchema>;
    try {
      body = BodySchema.check(req.body);
    } catch (error) {
      res.sendStatus(400);
      return;
    }

    const user = await db.getUserById({
      handle: store.handle,
      id: params.id,
    });
    if (user === null) {
      res.sendStatus(404);
      return;
    }

    switch (body.action) {
      case "follow": {
        const otherUserId = body.user_id;

        const otherUser = await db.getUserById({
          handle: store.handle,
          id: otherUserId,
        });
        if (otherUser === null) {
          res.sendStatus(406);
          return;
        }

        store.handle = await db.setUser({
          handle: store.handle,
          user: {
            ...user,
            followingIds: [
              ...user.followingIds.filter((id) => id !== otherUser.id),
              otherUser.id,
            ],
          },
        });

        res.sendStatus(200);
        return;
      }
      case "unfollow": {
        const otherUserId = body.user_id;

        if (user.followingIds.find((id) => id === otherUserId) === undefined) {
          res.sendStatus(406);
          return;
        }

        store.handle = await db.setUser({
          handle: store.handle,
          user: {
            ...user,
            followingIds: user.followingIds.filter((id) => id !== otherUserId),
          },
        });

        res.sendStatus(200);
        return;
      }
      case "view": {
        store.handle = await db.setUser({
          handle: store.handle,
          user: {
            ...user,
            viewCount: user.viewCount + 1,
          },
        });

        res.sendStatus(200);
        return;
      }
      default: {
        const exhaustiveCheck: never = body;
        throw new Error(
          `typescript should never let us get here: ${JSON.stringify(
            exhaustiveCheck
          )}`
        );
      }
    }
  },
};

export default routes;

export const _forTests = {
  store,
};
