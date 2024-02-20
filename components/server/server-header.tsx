"use client";

import Server from '@/models/server';

import React, { useEffect } from 'react'

const ServerHeader = ({server, role}) => {
    useEffect(() => {
        console.log(server);
    }, [])
    return (
        <div>
        <p><strong>Role:</strong> {role}</p>
        <p><strong>ID:</strong> {server._id.toString()}</p>
        <p><strong>Name:</strong> {server.name}</p>
        <p><strong>Image URL:</strong> <img src={server.imageUrl} alt="Server" /></p>
        <p><strong>Invite Code:</strong> {server.inviteCode}</p>
        <p><strong>User ID:</strong> {server.userId.toString()}</p>
        <h3>Channels:</h3>
        <ul>
          {server.channels.map(channel => (
            <li key={channel._id.toString()}>
              <p><strong>ID:</strong> {channel._id.toString()}</p>
              <p><strong>Name:</strong> {channel.name}</p>
              <p><strong>Type:</strong> {channel.type}</p>
              <p><strong>User ID:</strong> {channel.userId.toString()}</p>
              <p><strong>Server ID:</strong> {channel.serverId.toString()}</p>
              <p><strong>Created At:</strong> {new Date(channel.createdAt).toLocaleString()}</p>
              <p><strong>Updated At:</strong> {new Date(channel.updatedAt).toLocaleString()}</p>
            </li>
          ))}
        </ul>
        <h3>Members:</h3>
        <ul>
          {server.members.map(member => (
            <li key={member._id.toString()}>
              <p><strong>ID:</strong> {member._id.toString()}</p>
              <p><strong>Role:</strong> {member.role}</p>
              <p><strong>User ID:</strong> {member.userId.toString()}</p>
              <p><strong>Server ID:</strong> {member.serverId.toString()}</p>
              <p><strong>Created At:</strong> {new Date(member.createdAt).toLocaleString()}</p>
              <p><strong>Updated At:</strong> {new Date(member.updatedAt).toLocaleString()}</p>
            </li>
          ))}
        </ul>
        <p><strong>Created At:</strong> {new Date(server.createdAt).toLocaleString()}</p>
        <p><strong>Updated At:</strong> {new Date(server.updatedAt).toLocaleString()}</p>
        hello
      </div>
    )
}

export default ServerHeader