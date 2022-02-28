const registers = <const>{
  amperage: {
    bytes: 2,
    register: 0x13b2,
    parser: (buffer: Buffer) => buffer.readInt16BE(0) * 0.001,
    unit: "amps",
  },

  cellCount: {
    bytes: 2,
    register: 0x1388,
    parser: (buffer: Buffer) => buffer.readUInt16BE(0),
  },

  cell1Temperature: {
    bytes: 2,
    register: 0x139a,
    parser: (buffer: Buffer) => buffer.readUInt16BE(0) * 0.1,
    unit: "°c",
  },

  cell1Voltage: {
    bytes: 2,
    register: 0x1389,
    parser: (buffer: Buffer) => buffer.readUInt16BE(0) * 0.1,
    unit: "volts",
  },

  cell2Temperature: {
    bytes: 2,
    register: 0x139b,
    parser: (buffer: Buffer) => buffer.readUInt16BE(0) * 0.1,
    unit: "°c",
  },

  cell2Voltage: {
    bytes: 2,
    register: 0x139a,
    parser: (buffer: Buffer) => buffer.readUInt16BE(0) * 0.1,
    unit: "volts",
  },

  cell3Temperature: {
    bytes: 2,
    register: 0x139c,
    parser: (buffer: Buffer) => buffer.readUInt16BE(0) * 0.1,
    unit: "°c",
  },

  cell3Voltage: {
    bytes: 2,
    register: 0x139b,
    parser: (buffer: Buffer) => buffer.readUInt16BE(0) * 0.1,
    unit: "volts",
  },

  cell4Temperature: {
    bytes: 2,
    register: 0x139d,
    parser: (buffer: Buffer) => buffer.readUInt16BE(0) * 0.1,
    unit: "°c",
  },

  cell4Voltage: {
    bytes: 2,
    register: 0x139c,
    parser: (buffer: Buffer) => buffer.readUInt16BE(0) * 0.1,
    unit: "volts",
  },

  chargeCapacity: {
    bytes: 4,
    register: 0x13b6,
    parser: (buffer: Buffer) => buffer.readInt32BE(0) * 0.001,
    unit: "amp-hour",
  },

  chargeRemaining: {
    bytes: 4,
    register: 0x13b4,
    parser: (buffer: Buffer) => buffer.readInt32BE(0) * 0.001,
    unit: "amp-hours",
  },

  voltage: {
    bytes: 2,
    register: 0x13b3,
    parser: (buffer: Buffer) => buffer.readUInt16BE(0) * 0.01,
    unit: "volts",
  },
};
