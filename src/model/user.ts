import { Table, Column, Model, DataType } from 'sequelize-typescript';
// 表名
@Table({ modelName: 'users' })
export default class User extends Model<User> {
    @Column({
        primaryKey: true,
        autoIncrement: true,
        type: DataType.UUID,

    })
    public id: number;

    @Column(DataType.CHAR)
    public name: string;
}