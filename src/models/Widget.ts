import * as dbAPI from "../utils/databaseAPI";
import * as device from "./Device";

export interface Widget {
    _id: string;
    device_id: string;
    room_id: string;
    title: string;
    type: string;
    history_range: string;
    row: number;
    col: number;
    row_span: number;
    col_span: number;
    device: device.Device;
}

export async function getWidget(widgetId: string): Promise<Widget> {

    const widgetData = await dbAPI.getWidget(widgetId);

    const widget: Widget = widgetData;
     
    return widget;
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
        type: widgetData.type,
        history_range: widgetData.history_range,
        row: widgetData.row,
        col: widgetData.col,
        row_span: widgetData.row_span,
        col_span: widgetData.col_span,
        device: widgetData.device,
    }));

    return widgets;
}

export async function addWidget(
    deviceId: string,
    roomId: string,
    title: string,
    type: string,
    historyRange: string,
    row: number,
    col: number,
    rowSpan: number,
    colSpan: number) {

    return await dbAPI.insertWidget(deviceId, roomId, title, type, historyRange, row, col, rowSpan, colSpan)
}

export async function updateWidgetLocationAndSize(widgetId: string, row: number, col: number, rowSpan: number, colSpan: number) {
    return await dbAPI.updateWidgetLocationAndSize(widgetId, row, col, rowSpan, colSpan);
}

export async function updateWidgetHistoryRange(widgetId: string, historyRange: string) {
    return await dbAPI.updateWidgetHistoryRange(widgetId, historyRange);
}


export async function deleteWidget(widgetId: string) {
    return await dbAPI.deleteWidget(widgetId);
}