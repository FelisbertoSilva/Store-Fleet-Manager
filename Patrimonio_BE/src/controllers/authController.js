const keyFile = require('../secret.key');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('Database.db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const hashPassword = async (password) => {
    const saltRounds = 5;
    return await bcrypt.hash(password, saltRounds);
  };

const saveUserSQLite = async (username, password, role) => {
    const hashedPassword = await hashPassword(password);
    db.run('INSERT INTO users (username, password,role) VALUES (?, ?, ?)', [username, hashedPassword, role]);
  };
  


const markInactive = async (username) => {
  return new Promise((resolve, reject) => {
    db.run('UPDATE users SET role = ? WHERE username = ?', ['inactive', username], function(err) {
      if (err) {
        reject(err);
      } else {
        resolve({ message: 'User status updated to inactive', changes: this.changes });
      }
    });
  });
};

const markActive = async (username) => {
  return new Promise((resolve, reject) => {
    db.run('UPDATE users SET role = ? WHERE username = ?', ['employee', username], function(err) {
      if (err) {
        reject(err);
      } else {
        resolve({ message: 'User status updated to inactive', changes: this.changes });
      }
    });
  });
}; 
async function register(req, res,role) {
    const { username, password} = req.body;

    try {
        const exists = await checkExists(username);
        if (exists) {
            return res.status(400).json({ error: 'Duplicate Username.' });
        }
        if(password){
            if(password.length < 8 ){
                return res.status(400).json({error: 'Password Must Contain At Least 8 Characters'});
            } 
            else if(!/\d/.test(password)) {
                return res.status(400).json({ error: 'Password Must Contain At Least One Number' });
            }else if (!/[A-Z]/.test(password)) { 
                return res.status(400).json({ error: 'Password Must Contain At Least One Uppercase Letter' }); 
            } 
        }else { 
            return res.status(400).json({ error: 'Password is required' })
        }
        if(role === 'admin'){
            if(!password.includes('nibelis')){
               return res.status(400).json({error:'Password Not Valid for Admin'});
            }
        }
        await saveUserSQLite( username, password, role);

        res.status(201).json({ message: 'User Registered Successfully' });

    } catch (err) {
        if (err.name === 'ValidationError') {
            let errorMessage = 'Validation Error: ';
            for (const field in err.errors) {
                errorMessage += `${err.errors[field].message} `;
            }
            res.status(400).json({ error: errorMessage.trim() });

        } else {
            res.status(500).json({ error: 'Error saving user', details: err.message });
        }
    }
}




async function checkExists(username) {
    return new Promise((resolve, reject) => {
        db.get('SELECT * FROM users WHERE username = ? ', [username], (err, row) => {
            if (err) {
                reject(err);  
            } else {
                resolve(!!row);  
            }
        });
    });
}

async function login(req, res) {
    const { username, password } = req.body;
    try {
        const user = await fetchUserByUsername(username);
        if (user) {
            if (user.role === 'inactive') {
                return res.status(401).json({ error: 'Inactive user' });
            }

            const hashedPasswordFromDB = user.password;
            const passwordsMatch = await comparePasswords(password, hashedPasswordFromDB);
            if (passwordsMatch) {
                const authData = {
                    username: user.username,
                    role: user.role
                };

                const token = jwt.sign(authData, keyFile.securekey, { expiresIn: '10000h' });
                res.status(200).json({ userToken: token });
            } else {
                res.status(401).json({ error: ' Incorrect Password' });
            }
        } else {
            res.status(401).json({ error: 'Invalid Username' });
        }
    } catch (error) {
        res.status(500).json({ error: error });
    }
}

async function onOff(req, res) {
    try {
        const {username} = req.params;
        console.log(username);
        const user = await fetchUserByUsername(username);
        console.log(user);

        if (user) {
            if(user.role !== 'inactive'){
            markInactive(username);
            res.status(200).json({[username] : 'Inactive'});
        }else if (user.role === 'inactive')  {
            markActive(username);
            res.status(200).json({[username] : 'employee'});
        } 
        } else {
            res.status(401).json({ error: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error });
    }
}

const fetchUserByUsername = (username) => {
    return new Promise((resolve, reject) => {
        db.get('SELECT * FROM users WHERE username = ?', [username], (err, row) => {
            if (err) {
                reject(err);
            } else {
                resolve(row);
            }
        });
    });
};
 
const { open } = require('sqlite');

async function openDB() {
    return open({
        filename: 'Database.db',
        driver: sqlite3.Database
    });
}

async function fetchAllUsers(req, res) {
    try {
        const db = await openDB();
        const users = await db.all('SELECT username,role FROM users WHERE role <> "admin"');
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching Users', error: error.message });
    }
}

const comparePasswords = (password, hashedPassword) => {
    return bcrypt.compare(password, hashedPassword);
};



module.exports = { register, login, checkExists,onOff,fetchAllUsers };
