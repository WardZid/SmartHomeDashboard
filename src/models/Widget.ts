import * as dbAPI from "../utils/databaseAPI";
import * as lsAPI from "../utils/localStorage";
import * as device from "./Device";

export interface Widget {
    _id: string;
    device_id: string;
    room_id: string;
    title: string;
    row: number;
    col: number;
    row_span: number;
    col_span: number;
    device: device.Device;
}


export async function getWidgets(roomId: string): Promise<Widget[]> {
    // get widgets as a json array
    const widgetsData = await dbAPI.getWidgets(roomId);

    // map returned json array to widgets
    const widgets: Widget[] = widgetsData.map((widgetData: any) => ({
        _id: widgetData._id,
        device_id: widgetData.device_id,
        room_id: widgetData.room_id,
        title: widgetData.title,
        row: widgetData.row,
        col: widgetData.col,
        row_span: widgetData.row_span,
        col_span: widgetData.col_span,
        device: widgetData.device,
    }));

    return widgets;
}

export async function updateWidgetLocationAndSize(widgetId: string, row: number, col: number, rowSpan: number, colSpan: number) {
    return await dbAPI.updateWidgetLocationAndSize(widgetId, row, col,rowSpan,colSpan);
}