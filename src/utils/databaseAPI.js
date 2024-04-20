import * as lsAPI from "./localStorage";
import * as user from "../models/User";

const registerEndpoint =
  "https://realm.mongodb.com/api/client/v2.0/app/data-rtanz/auth/providers/local-userpass/register";
const loginEndpoint =
  "https://realm.mongodb.com/api/client/v2.0/app/data-rtanz/auth/providers/local-userpass/login";
const refreshTokenEndpoint =
  "https://services.cloud.mongodb.com/api/client/v2.0/auth/session";
const dataEndpoint =
  "https://eu-central-1.aws.data.mongodb-api.com/app/data-rtanz/endpoint/data/v1/action";

const databaseName = "SmartHomeDatabase";
const dataSourceName = "Cluster0";
const accessTokenExpiry = 1800; // 30 mins
const refreshTokenExpiry = 5184000; // 60 days
const userIDExpiry = 5184000; // 60 days

export async function register(email, password) {
  const data = {
    email: email,
    password: password,
  };

  try {
    const response = await fetch(registerEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const responseData = await response.json();
    console.log(responseData);
    if (responseData && responseData.error) {
      throw new Error(responseData.error);
    } else {
      return responseData;
    }
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}
export async function login(email, password) {
  const data = {
    username: email,
    password: password,
  };

  try {
    const response = await fetch(loginEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const responseData = await response.json();
    if (responseData && responseData.error) {
      return false;
    } else {
      lsAPI.setAccessToken(responseData.access_token, accessTokenExpiry);
      lsAPI.setRefreshToken(responseData.refresh_token, refreshTokenExpiry);
      lsAPI.setUserID(responseData.user_id, userIDExpiry);

      return true;
    }
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

export async function refreshAccessToken() {
  const refreshToken = lsAPI.getRefreshToken();
  const request = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${refreshToken}`,
    },
  };
  try {
    const response = await fetch(refreshTokenEndpoint, request);
    if (!response.ok) {
      //user.signOut();
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const responseData = await response.json();
    if (responseData.access_token) {
      lsAPI.setAccessToken(responseData.access_token, accessTokenExpiry);
    }
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
}

function buildRequest(collectionName, additionalData) {
  const accessToken = lsAPI.getAccessToken();

  const requestData = {
    collection: collectionName,
    database: databaseName,
    dataSource: dataSourceName,
    ...additionalData,
  };

  const request = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(requestData),
  };
  return request;
}

async function send(endpoint, collectionName, requestData) {
  const isLoggedIn = await user.isLoggedIn();
  if (isLoggedIn === false) {
    throw new user.AuthenticationError("Not logged in!");
  }

  //building request after login check so the request is built with the updated accestoken (in case it was refreshed)
  const request = buildRequest(collectionName, requestData);

  try {
    const response = await fetch(endpoint, request);

    if (!response.ok) {
      if (response.status === 401) {
        //user.signOut();
      }
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
}
async function findOne(collectionName, requestData) {
  const endpoint = dataEndpoint + "/findOne";
  const response = await send(endpoint, collectionName, requestData);
  return response.document;
}
async function findMany(collectionName, requestData) {
  const endpoint = dataEndpoint + "/find";
  const response = await send(endpoint, collectionName, requestData);
  return response.documents;
}
async function aggregate(collectionName, requestData) {
  const endpoint = dataEndpoint + "/aggregate";
  const response = await send(endpoint, collectionName, requestData);
  return response.documents;
}
async function insertOne(collectionName, requestData) {
  const endpoint = dataEndpoint + "/insertOne";
  const response = await send(endpoint, collectionName, requestData);
  return response;
}
async function updateOne(collectionName, updateData, filterId) {
  const endpoint = dataEndpoint + "/updateOne";

  const requestData = {
    filter: {
      _id: { $oid: filterId },
    },
    update: {
      $set: {
        ...updateData,
      },
    },
  };
  const response = await send(endpoint, collectionName, requestData);
  return response;
}

async function deleteOne(collectionName, requestData) {
  const endpoint = dataEndpoint + "/deleteOne";
  const response = await send(endpoint, collectionName, requestData);
  return response;
}

async function deleteMany(collectionName, requestData) {
  const endpoint = dataEndpoint + "/deleteMany";
  const response = await send(endpoint, collectionName, requestData);
  return response;
}

export async function insertNewUserInfo(userId, firstName, lastName, homeId) {
  const requestData = {
    document: {
      _id: { $oid: userId },
      first_name: firstName,
      last_name: lastName,
      home_id: { $oid: homeId },
    },
  };
  return await insertOne("users", requestData);
}

export async function fetchUserInfo() {
  const userID = lsAPI.getUserID();
  const requestData = {
    filter: {
      _id: { $oid: userID },
    },
  };
  return await findOne("users", requestData);
}

export async function insertRoom(roomName) {
  const userID = lsAPI.getUserID();
  const requestData = {
    document: {
      room_name: roomName,
      user_id: { $oid: userID },
    },
  };
  return await insertOne("rooms", requestData);
}

export async function deleteRoom(roomId) {
  const requestData = {
    filter: {
      _id: { $oid: roomId },
    },
  };
  return await deleteOne("rooms", requestData);
}

export async function getRooms() {
  const userID = lsAPI.getUserID();
  const requestData = {
    filter: {
      user_id: { $oid: userID },
    },
  };
  return await findMany("rooms", requestData);
}

export async function getWidget(widgetId) {
  const requestData = {
    pipeline: [
      {
        $match: {
          _id: { $oid: widgetId },
        },
      },
      {
        $lookup: {
          from: "devices",
          localField: "device_id",
          foreignField: "_id",
          as: "device",
        },
      },
      {
        $unwind: "$device",
      },
    ],
  };

  return (await aggregate("widgets", requestData))[0];
}

export async function insertWidget(
  deviceId,
  roomId,
  title,
  type,
  historyRange,
  row,
  col,
  rowSpan,
  colSpan
) {
  const requestData = {
    document: {
      device_id: { $oid: deviceId },
      room_id: { $oid: roomId },
      title: title,
      type: type,
      history_range: historyRange,
      row: row,
      col: col,
      row_span: rowSpan,
      col_span: colSpan,
    },
  };
  return await insertOne("widgets", requestData);
}

export async function deleteWidget(widgetId) {
  const requestData = {
    filter: {
      _id: { $oid: widgetId },
    },
  };
  return await deleteOne("widgets", requestData);
}

export async function deleteWidgetsOfRoom(roomId) {
  const requestData = {
    filter: {
      room_id: { $oid: roomId },
    },
  };
  return await deleteMany("widgets", requestData);
}

export async function getWidgets(roomId) {
  const requestData = {
    pipeline: [
      {
        $match: {
          room_id: { $oid: roomId },
        },
      },
      {
        $lookup: {
          from: "devices",
          localField: "device_id",
          foreignField: "_id",
          as: "device",
        },
      },
      {
        $unwind: "$device",
      },
      //tried to add a filter for dates but some memory leak completely fucked everything
    ],
  };

  return await aggregate("widgets", requestData);
}

export async function updateWidgetLocationAndSize(
  widgetId,
  row,
  col,
  rowSpan,
  colSpan
) {
  const updateData = {
    row: row,
    col: col,
    row_span: rowSpan,
    col_span: colSpan,
  };
  return await updateOne("widgets", updateData, widgetId);
}

export async function updateWidgetHistoryRange(widgetId, historyRange) {
  const updateData = {
    history_range: historyRange,
  };
  return await updateOne("widgets", updateData, widgetId);
}

export async function updateDeviceState(deviceId, state) {
  const updateData = {
    "measurement.state": state,
  };
  return await updateOne("devices", updateData, deviceId);
}

export async function getDevice(deviceId) {
  const requestData = {
    filter: {
      _id: { $oid: deviceId },
    },
  };
  return await findOne("devices", requestData);
}

export async function getDevices(homeId) {
  const requestData = {
    filter: {
      home_id: { $oid: homeId },
    },
  };
  return await findMany("devices", requestData);
}

export async function insertEvent(
  deviceId,
  eventDateTime,
  weekDays,
  state,
  active
) {
  const requestData = {
    document: {
      device_id: { $oid: deviceId },
      datetime: eventDateTime,
      week_days: weekDays,
      state: state,
      active: active,
    },
  };
  return await insertOne("events", requestData);
}

export async function deleteEvent(eventId) {
  const requestData = {
    filter: {
      _id: { $oid: eventId },
    },
  };
  return await deleteOne("events", requestData);
}

export async function deleteEventsOfDevice(deviceId) {
  const requestData = {
    filter: {
      device_id: { $oid: deviceId },
    },
  };
  return await deleteMany("events", requestData);
}

export async function getEvents(deviceId) {
  const requestData = {
    filter: {
      device_id: { $oid: deviceId },
    },
  };
  return await findMany("events", requestData);
}

export async function updateEventDaysOfWeek(eventId, daysOfWeek) {
  const updateData = {
    week_days: daysOfWeek,
  };
  return await updateOne("events", updateData, eventId);
}

export async function updateEventActive(eventId, active) {
  const updateData = {
    active: active,
  };
  return await updateOne("events", updateData, eventId);
}

//adds sample data
export async function addHistoryEntries(deviceId, historyEntries) {
  try {
    const endpoint = dataEndpoint + "/updateOne";

    const requestData = {
      filter: {
        _id: { $oid: deviceId },
      },
      update: {
        $push: {
          history: { $each: historyEntries },
        },
      },
    };
    const response = await send(endpoint, "devices", requestData);
  } catch (error) {
    console.error("Error adding history entries:", error);
    throw error;
  }
}

