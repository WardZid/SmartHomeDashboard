import * as dbAPI from "../utils/databaseAPI";
import * as lsAPI from "../utils/localStorage";

export async function getWidgets(roomId: string) {
    return await dbAPI.getWidgets(roomId);
}

export async function updateWidgetLocation(widgetId: string, row: number, col: number) {
    return await dbAPI.updateWidgetLocation(widgetId, row, col);
}