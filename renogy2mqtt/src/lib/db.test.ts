import * as db from "./db";

describe("db", () => {
  describe("getInitialHandler", () => {
    it("should give back correct default", async () => {
      expect(JSON.parse(db.getInitialHandle())).toEqual({
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
    });
  });

  describe("getUsers", () => {
    it("should give back correct default", async () => {
      expect(await db.getUsers({ handle: db.getInitialHandle() })).toEqual([
        {
          username: "jimmy_neutron",
          id: "jimmy",
          viewCount: 210,
          followingIds: ["hugh", "judy"],
        },
        {
          username: "hugh_neutron",
          id: "hugh",
          viewCount: 10,
          followingIds: ["judy"],
        },
        {
          username: "judy_neutron",
          id: "judy",
          viewCount: 10,
          followingIds: [],
        },
        {
          username: "carl_wheezer",
          id: "carl",
          viewCount: 0,
          followingIds: ["jimmy"],
        },
      ]);
    });
  });

  describe("getUserById", () => {
    it("should give user when given valid id", async () => {
      expect(
        await db.getUserById({ handle: db.getInitialHandle(), id: "jimmy" })
      ).toEqual({
        username: "jimmy_neutron",
        id: "jimmy",
        viewCount: 210,
        followingIds: ["hugh", "judy"],
      });
    });

    it("should give null when given invalid id", async () => {
      expect(
        await db.getUserById({ handle: db.getInitialHandle(), id: "sheen" })
      ).toBeNull();
    });
  });

  describe("setUser", () => {
    const handle = JSON.stringify({
      usersById: {
        a: {
          username: "foo",
          id: "a",
          viewCount: 42,
          followingIds: ["b", "c"],
        },
      },
    });

    it("should add a new user", async () => {
      const user = {
        username: "bar",
        id: "b",
        viewCount: 33,
        followingIds: [],
      };
      expect(JSON.parse(await db.setUser({ handle, user }))).toEqual({
        usersById: {
          a: {
            username: "foo",
            id: "a",
            viewCount: 42,
            followingIds: ["b", "c"],
          },
          b: user,
        },
      });
    });

    it("should update existing user", async () => {
      const user = {
        username: "bar",
        id: "a",
        viewCount: 33,
        followingIds: [],
      };
      expect(JSON.parse(await db.setUser({ handle, user }))).toEqual({
        usersById: {
          a: user,
        },
      });
    });
  });
});
