import * as dbAPI from "../utils/databaseAPI";
import * as lsAPI from "../utils/localStorage";

export interface Widget {
    _id: string;
    device_id: string;
    room_id: string;
    title: string;
    row: number;
    col: number;
    row_span: number;
    col_span: number;
}


export async function getWidgets(roomId: string) {
    return await dbAPI.getWidgets(roomId);
}

export async function updateWidgetLocation(widgetId: string, row: number, col: number) {
    return await dbAPI.updateWidgetLocation(widgetId, row, col);
}