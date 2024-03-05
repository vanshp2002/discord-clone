import { useState } from "react";
import ServerContext from "./ServerState";

const ServerState = (props) => {
    const initialState = []
    const [servers, setServers] = useState(initialState);

    const getServers = async () => {
        
    }
    return (
        <ServerContext.Provider value={{ servers, setServers, getServers}}>
            {props.children}
        </ServerContext.Provider>
    )
}

export default ServerState;