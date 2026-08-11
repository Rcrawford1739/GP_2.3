const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    firstName: String,
    lastName: String,
    email: {
        type: String,
        // 1. SETTER: Forces the email to be lowercase before saving to the database
        set: function(email) {
            return email.toLowerCase();
        }
    },
    username: {
        type: String,
        trim: true
    },
    password: String,
    website: {
        type: String,
        // 2. GETTER: Appends 'http://' to the website URL when retrieving it, if it's missing
        get: function(url) {
            if (!url) return url;
            if (url.indexOf('http://') !== 0 && url.indexOf('https://') !== 0) {
                return 'http://' + url;
            }
            return url;
        }
    },
    created: {
        type: Date,
        // 3. DEFAULT: Automatically sets the current date/time when a user is created
        default: Date.now 
    }
});

// 4. VIRTUAL: Computes a 'fullName' property on the fly without saving it to the database
UserSchema.virtual('fullName')
    .get(function() {
        return this.firstName + ' ' + this.lastName;
    })
    .set(function(fullName) {
        const splitName = fullName.split(' ');
        this.firstName = splitName[0] || '';
        this.lastName = splitName[1] || '';
    });

// 5. CONFIGURATION: Tells Mongoose to include getters and virtuals when converting the document to JSON
UserSchema.set('toJSON', {
    getters: true,
    virtuals: true
});

mongoose.model('User', UserSchema);