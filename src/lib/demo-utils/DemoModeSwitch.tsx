import { Switch } from "@salt-ds/core"
import { useAppSettings } from "../AppSettingsContext";

const DemoModeSwitch = () => {
    const { isDemoMode, setIsDemoMode } = useAppSettings();
    return (
        <Switch
            label="Demo Mode"
            onChange={() => {
                setIsDemoMode(!isDemoMode);
            }}
            style={{
                position: 'absolute',
                top: '5px',
                right: '5px'
            }}
        />
    )
}

export default DemoModeSwitch;