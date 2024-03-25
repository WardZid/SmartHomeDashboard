import * as dbAPI from "../utils/databaseAPI";
import * as lsAPI from "../utils/localStorage";

export interface Device {
    _id: string;
    type: string;
    measurement: Measurement;
}

export interface Measurement {
    type: string;
    min: number;
    max: number;
    state: string
}

export async function updateDeviceState(deviceId: string, state: string) {
    return await dbAPI.updateDeviceState(deviceId, state);
}

export async function getDevice(deviceId: string): Promise<Device> {

    const deviceData = await dbAPI.getDevice(deviceId);

    const device: Device = deviceData

    return device;
}
