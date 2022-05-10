import { Gender } from "../types"

export const formatGender = (gender: Gender): string => {
    if (gender == Gender.MALE) {
        return "男"
    } else if (gender == Gender.FEMALE) {
        return "女"
    } else {
        return ""
    }
}