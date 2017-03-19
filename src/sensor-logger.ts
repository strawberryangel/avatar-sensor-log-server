import { AvatarSensorReading } from '@blackpaw/avatar-sensor'

export class SensorLogger {
    private sensorlog: any
    constructor(private connection: any) {
        this.sensorlog = this.connection.collection("sensorlog")
    }

    public add = (sensorReading: AvatarSensorReading) => {
        this.sensorlog.insert(sensorReading, (error) => {
            if (error)
                console.error(
                    'Failed to insert into sensor log: ', sensorReading
                )
        })
    }
}
