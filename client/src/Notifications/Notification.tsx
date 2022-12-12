import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../Auth/ContextProvider";
import { baseURL } from "../utils/api";
import { UserProps } from "../models/User";
interface NotificationProps {
    sender?: UserProps;
    receiver: UserProps;
    message: string;
}

const Notification = (props:NotificationProps) => {
    const { sender, receiver, message } = props;
    return (
      <div>
        {sender && <h1>{sender.name}</h1>}
      </div>
    );
};

export default Notification;