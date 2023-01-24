import axios from "axios";
import React, { useState } from "react";

const useAPICall = (url) => {

        const [data, setState] = useState([])
        const makeAPIcall = async () => {
            const res = await axios.get(url)
            setState([...data, res.data])
        }
        console.log(data)
        return [data, makeAPIcall]
    }

    export default useAPICall