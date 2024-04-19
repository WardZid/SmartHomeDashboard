import * as dbAPI from "../utils/databaseAPI";
import * as userModel from "./User"

export interface Device {
    _id: string;
    type: string;
    title: string;
    home_id: string;
    measurement: Measurement;
    history: History[];
}

export interface Measurement {
    type: string;
    min: number;
    max: number;
    state: string
}

export interface History {
    datetime: Date;
    state: string;
}

export async function updateDeviceState(deviceId: string, state: string) {
    return await dbAPI.updateDeviceState(deviceId, state);
}

export async function getDevice(deviceId: string): Promise<Device> {

    const deviceData = await dbAPI.getDevice(deviceId);

    const device: Device = deviceData;
    
    return device;
}


export async function getDevices(): Promise<Device[]> {
    try {
        const userInfo = await userModel.getUserInfo();
        if (userInfo === null) {
            return [];
        }
        const devicesData = await dbAPI.getDevices(userInfo.home_id);
        
        // Transform the response into an array of Device objects
        const devices: Device[] = devicesData.map((device: any) => ({
            _id: device._id,
            type: device.type,
            title: device.title,
            home_id: device.home_id,
            measurement: device.measurement
        }));

        return devices;
    } catch (error) {
        // Handle errors
        console.error('Error fetching devices:', error);
        throw new Error('Failed to fetch devices');
    }
}