import express from "express";
import * as db from "./db";
import routes, { _forTests as routes_forTests } from "./routes";

describe("routes", () => {
  beforeEach(() => (routes_forTests.store.handle = db.getInitialHandle()));

  describe("GET /users", () => {
    it("should json users", async () => {
      const req = {};
      const res = {
        json: jest.fn(),
      };

      await routes["GET /users"](
        req as unknown as express.Request,
        res as unknown as express.Response
      );

      expect(res.json).toHaveBeenCalledWith([
        {
          username: "jimmy_neutron",
          id: "jimmy",
          viewCount: 210,
        },
        {
          username: "hugh_neutron",
          id: "hugh",
          viewCount: 10,
        },
        {
          username: "judy_neutron",
          id: "judy",
          viewCount: 10,
        },
        {
          username: "carl_wheezer",
          id: "carl",
          viewCount: 0,
        },
      ]);
    });
  });

  describe("GET /users/:id", () => {
    it("should json user", async () => {
      const req = {
        params: {
          id: "carl",
        },
      };
      const res = {
        json: jest.fn(),
        sendStatus: jest.fn(),
      };

      await routes["GET /users/:id"](
        req as unknown as express.Request,
        res as unknown as express.Response
      );

      expect(res.json).toHaveBeenCalledWith({
        username: "carl_wheezer",
        id: "carl",
        viewCount: 0,
        following: [
          {
            username: "jimmy_neutron",
            id: "jimmy",
            viewCount: 210,
          },
        ],
      });
      expect(res.sendStatus).not.toHaveBeenCalled();
    });

    it("should 404 non-user", async () => {
      const req = {
        params: {
          id: "sheen",
        },
      };
      const res = {
        json: jest.fn(),
        sendStatus: jest.fn(),
      };

      await routes["GET /users/:id"](
        req as unknown as express.Request,
        res as unknown as express.Response
      );

      expect(res.json).not.toHaveBeenCalled();
      expect(res.sendStatus).toHaveBeenCalledWith(404);
    });
  });

  describe("PATCH /users/:id", () => {
    it("should 404 on bad id", async () => {
      const req = {
        params: {
          id: "sheen",
        },
        body: {
          action: "view",
        },
      };
      const res = {
        sendStatus: jest.fn(),
      };

      await routes["PATCH /users/:id"](
        req as unknown as express.Request,
        res as unknown as express.Response
      );

      expect(res.sendStatus).toHaveBeenCalledWith(404);
    });

    it("should 400 on bad action", async () => {
      const req = {
        params: {
          id: "carl",
        },
        body: {
          action: "jump",
        },
      };
      const res = {
        sendStatus: jest.fn(),
      };

      await routes["PATCH /users/:id"](
        req as unknown as express.Request,
        res as unknown as express.Response
      );

      expect(res.sendStatus).toHaveBeenCalledWith(400);
    });

    describe("view", () => {
      it("should increment view counter", async () => {
        const req = {
          params: {
            id: "carl",
          },
          body: {
            action: "view",
          },
        };
        const res = {
          sendStatus: jest.fn(),
        };

        await routes["PATCH /users/:id"](
          req as unknown as express.Request,
          res as unknown as express.Response
        );

        expect(res.sendStatus).toHaveBeenCalledWith(200);
        expect(
          JSON.parse(routes_forTests.store.handle).usersById.carl.viewCount
        ).toBe(1);
      });
    });

    describe("follow", () => {
      it("should 200 on valid other id", async () => {
        const req = {
          params: {
            id: "carl",
          },
          body: {
            action: "follow",
            user_id: "hugh",
          },
        };
        const res = {
          sendStatus: jest.fn(),
        };

        await routes["PATCH /users/:id"](
          req as unknown as express.Request,
          res as unknown as express.Response
        );

        expect(res.sendStatus).toHaveBeenCalledWith(200);
        expect(
          JSON.parse(routes_forTests.store.handle).usersById.carl.followingIds
        ).toEqual(["jimmy", "hugh"]);
      });

      it("should 406 on invalid other id", async () => {
        const req = {
          params: {
            id: "carl",
          },
          body: {
            action: "follow",
            user_id: "sheen",
          },
        };
        const res = {
          sendStatus: jest.fn(),
        };

        await routes["PATCH /users/:id"](
          req as unknown as express.Request,
          res as unknown as express.Response
        );

        expect(res.sendStatus).toHaveBeenCalledWith(406);
      });
    });

    describe("unfollow", () => {
      it("should 200 on valid other id", async () => {
        const req = {
          params: {
            id: "carl",
          },
          body: {
            action: "unfollow",
            user_id: "jimmy",
          },
        };
        const res = {
          sendStatus: jest.fn(),
        };

        await routes["PATCH /users/:id"](
          req as unknown as express.Request,
          res as unknown as express.Response
        );

        expect(res.sendStatus).toHaveBeenCalledWith(200);
        expect(
          JSON.parse(routes_forTests.store.handle).usersById.carl.followingIds
        ).toEqual([]);
      });

      it("should 406 on invalid other id", async () => {
        const req = {
          params: {
            id: "carl",
          },
          body: {
            action: "unfollow",
            user_id: "sheen",
          },
        };
        const res = {
          sendStatus: jest.fn(),
        };

        await routes["PATCH /users/:id"](
          req as unknown as express.Request,
          res as unknown as express.Response
        );

        expect(res.sendStatus).toHaveBeenCalledWith(406);
      });
    });
  });
});
