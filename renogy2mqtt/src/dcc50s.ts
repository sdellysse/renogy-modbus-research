const mappings = <const>{
  auxBatteryTemperature: {
    bytes: 2,
    register: 0x103,
    parser: (buffer: Buffer) => buffer.readInt8(1),
    unit: "°c",
  },

  chargingStateFlags: {
    bytes: 1,
    register: 0x120,
    parser: (buffer: Buffer) =>
      <const>{
        alternator: (buffer.readUInt16BE(0) & 0b0000000010000000) > 0,
        boost: (buffer.readUInt16BE(0) & 0b0000000000010000) > 0,
        equalization: (buffer.readUInt16BE(0) & 0b0000000000001000) > 0,
        float: (buffer.readUInt16BE(0) & 0b0000000000100000) > 0,
        limited: (buffer.readUInt16BE(0) & 0b0000000001000000) > 0,
        none: (buffer.readUInt16BE(0) & 0b0000000000000001) > 0,
        solar: (buffer.readUInt16BE(0) & 0b0000000000000100) > 0,
      },
    unit: "flags",
  },

  controllerTemperature: {
    byte: 1,
    register: 0x103,
    parser: (buffer: Buffer) => buffer.readInt8(0),
    unit: "°c",
  },

  errorFlags: {
    bytes: 4,
    register: 0x121,
    parser: (buffer: Buffer) =>
      <const>{
        alternatorInputOvercurrent:
          (buffer.readInt16BE(0) & 0b0000000000100000) > 0,
        alternatorInputOvervoltage:
          (buffer.readInt16BE(0) & 0b0000000100000000) > 0,
        auxBatteryOverDischarger:
          //TODO was here
          (buffer.readInt16BE(0) & 0b0000100000000000) > 0,
        auxLowTemperatureProtection:
          (buffer.readInt16BE(0) & 0b0000100000000000) > 0,
        bmsOverchargeProtection:
          (buffer.readInt16BE(0) & 0b0000010000000000) > 0,
        controllerOverTemperature2:
          (buffer.readUInt16BE() & 0b0000000000010000) > 0,
        starterReversePolarity:
          (buffer.readInt16BE(0) & 0b0000001000000000) > 0,
      },
    unit: "flags",
  },
};
