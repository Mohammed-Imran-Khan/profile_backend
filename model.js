import mongoose from "mongoose";

const employeeschema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        match: [/^[a-zA-Z\s]+$/, 'Name must only contain alpha characters and spaces'],

    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        trim: true,
        lowercase: true,
        validate: {
            validator: function (value) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return emailRegex.test(value);
            },
            message: 'Email must be a valid one',
        }
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        validate: [
            {
                validator: function (value) {
                    return value.length >= 8;
                },
                message: 'Password should be at least 8 characters long',
            },
            {
                validator: function (value) {
                    const uppercaseRegex = /[A-Z]/;
                    return uppercaseRegex.test(value);
                },
                message: 'Password should contain at least one uppercase letter',
            },
            {
                validator: function (value) {
                    const lowercaseRegex = /[a-z]/;
                    return lowercaseRegex.test(value);
                },
                message: 'Password should contain at least one lowercase letter',
            },
            {
                validator: function (value) {
                    const digitRegex = /\d/;
                    return digitRegex.test(value);
                },
                message: 'Password should contain at least one digit',
            },
            {
                validator: function (value) {
                    const specialCharRegex = /[!@#$%^&*]/;
                    return specialCharRegex.test(value);
                },
                message: 'Password should contain at least one special character',
            },
        ],
        trim: true
    },
    token:String,
    profilePicture:{
        type:String
     },
     tenthCertificate:{
        type:String
    },
    twelfthCertificate:{
        type:String
    },
    ugCertificate:{
        type:String
    },

});

const Employee = mongoose.model("Employee", employeeschema);
export default Employee;
