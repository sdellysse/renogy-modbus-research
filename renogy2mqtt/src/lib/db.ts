import * as rt from "runtypes";

// setup database schema types
const UserId = rt.String;
type UserId = rt.Static<typeof UserId>;

const User = rt.Record({
  id: UserId,
  username: rt.String,
  viewCount: rt.Number,
  followingIds: rt.Array(UserId),
});
type User = rt.Static<typeof User>;

const Database = rt.Record({
  usersById: rt.Dictionary(User, UserId),
});
type Database = rt.Static<typeof Database>;

// unnecessarily-async functions to simulate external database
type DatabaseHandle = string;
const thaw = async (handle: DatabaseHandle): Promise<Database> =>
  Database.check(JSON.parse(handle));

const freeze = async (database: Database): Promise<DatabaseHandle> =>
  JSON.stringify(database);

// nice defaults to play with
export const getInitialHandle = (): DatabaseHandle =>
  JSON.stringify({
    usersById: {
      jimmy: {
        username: "jimmy_neutron",
        id: "jimmy",
        viewCount: 210,
        followingIds: ["hugh", "judy"],
      },
      hugh: {
        username: "hugh_neutron",
        id: "hugh",
        viewCount: 10,
        followingIds: ["judy"],
      },
      judy: {
        username: "judy_neutron",
        id: "judy",
        viewCount: 10,
        followingIds: [],
      },
      carl: {
        username: "carl_wheezer",
        id: "carl",
        viewCount: 0,
        followingIds: ["jimmy"],
      },
    },
  });

// actual db operations
type InputGetUserById = {
  readonly handle: DatabaseHandle;
  readonly id: UserId;
};
export const getUserById = async ({
  handle,
  id,
}: InputGetUserById): Promise<User | null> =>
  (await thaw(handle)).usersById[id] ?? null;

type InputGetUsers = {
  readonly handle: DatabaseHandle;
};
export const getUsers = async ({ handle }: InputGetUsers): Promise<User[]> => {
  return Object.values((await thaw(handle)).usersById);
};

type InputSetUser = {
  readonly handle: DatabaseHandle;
  readonly user: User;
};
export const setUser = async ({
  handle,
  user,
}: InputSetUser): Promise<DatabaseHandle> => {
  const db = await thaw(handle);
  return await freeze({
    ...db,
    usersById: {
      ...db.usersById,
      [user.id]: user,
    },
  });
};
