const db = require('../config/db');

class User {

    static async createUser(data) {
        try {
            let role = data.role || 'USER';
            let sql = `INSERT INTO users (login, password, full_name, email, role) 
                VALUES ('${data.login}', '${data.password}', '${data.full_name}', '${data.email}', '${role}')`;
            const [user, _] = await db.execute(sql);
            return user;
        } catch (error) {
            console.log(error);
        }
    }

    static async getAllUsers() {
        try {
            let sql = `SELECT * FROM users`;
            const [data, _] = await db.execute(sql);
            return data;
        } catch (error) {
            console.log(error);
        }
    }

    static async getUserData(column, value) {
        try {
            let sql = `SELECT * FROM users WHERE ${column} = '${value}'`;
            const [data, _] = await db.execute(sql);
            return data[0];
        } catch (error) {
            console.log(error);
        }
    }

    static async updateUserData(id, data) {
        try {
            let sql = `UPDATE users 
                SET login = '${data.login}', password = '${data.password}', full_name= '${data.full_name}',
                    email = '${data.email}', role = '${data.role}' 
                WHERE id = ${id}`;
            await db.execute(sql);
            return await User.getUserData('id', id);
        } catch (error) {
            console.log(error);
        }
    }

    static async updateUserRating(id, rating) {
        try {
            let sql = `UPDATE users 
                SET rating = '${rating}' 
                WHERE id = ${id}`;
            return await db.execute(sql);
        } catch (error) {
            console.log(error);
        }
    }

    static async uploadUserAvatar(id, avatarName) {
        try {
            let sql = `UPDATE users SET avatar = '${avatarName}' WHERE id = ${id}`;
            return await db.execute(sql);
        } catch (error) {
            console.log(error);
        }
    }

    static async resetPassword(id, password) {
        try {
            let sql = `UPDATE users SET password = '${password}' WHERE id = ${id}`;
            return await db.execute(sql);
        } catch (error) {
            console.log(error);
        }
    }

    static async accountActivation(id) {
        try {
            let sql = `UPDATE users SET activated = true WHERE id = ${id}`;
            return await db.execute(sql);
        } catch (error) {
            console.log(error);
        }
    }

    static async deleteUserById(id) {
        try {
            let sql = `DELETE FROM users WHERE id = ${id}`;
            return await db.execute(sql);
        } catch (error) {
            console.log(error);
        }
    }

}

module.exports = User;
