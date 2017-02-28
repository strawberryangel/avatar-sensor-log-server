import { AvatarSensorReading } from '@blackpaw/avatar-sensor'

export class SensorLogger {
    constructor(private connection: any) {
    }

    private get db() {
        return this.connection.collection("sensorlog")
    }

    public add = (sensorReading: AvatarSensorReading) => {
        this.db.insert(sensorReading, (error) => {
            if (error)
                console.error(
                    'Failed to insert into sensor log: ', sensorReading
                )
        })
    }
}
