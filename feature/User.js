import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Text, View } from 'react-native';



// To be added :- Functionality to include auth_token



let URL = "http://api.dwall.xyz/v1/profile/";
const getAllUsers = async () => {
    fetch(URL+'get')
        .then((response) => response.json())
        .then((jsonResponse) => {return jsonResponse;})
        .catch((err) => {
            console.log(err);
        });
};


const getUser = async (number) => {
  const [user, setUser] = useState(null);
    return fetch(URL+'get',{
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
        body: JSON.stringify({
            _id: number,

        })
    })
        .then((response) => response.json())
        .then((jsonResponse) => {
          console.log(jsonResponse);
          setUser(jsonResponse);})
        .catch((err) => {
            console.log(err);
        });

        return user;
};


const addUser = async (number, name, dspn, email) => {
  //Pass auth_token from confirm.verificationId
    fetch(URL+'add',{
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
        body: JSON.stringify({
            _id: number,
            name: name,
            displayName: dspn,
            e_mail: email

        })
    })
};


const updateUser = async (number, name, dspn, email) => {
    fetch(URL+'add',{
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
        body: JSON.stringify({
            phoneNumber: number,
            fullName: name,
            displayName: dspn,
            Email: email,

        })
    })
};


export {addUser, getUser, updateUser};
