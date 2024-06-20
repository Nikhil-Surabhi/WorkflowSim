import constants from "./constants.config";
import moment from "moment";
export const foramatedDate = date => {
    // console.log(date);
    return moment(date).format(constants.dateFormat);
}
