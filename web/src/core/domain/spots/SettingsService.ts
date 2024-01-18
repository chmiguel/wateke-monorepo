import { UserConfig } from "./Spot";

export default interface SettingsService {
    getAvailableSettings(): UserConfig[];
}