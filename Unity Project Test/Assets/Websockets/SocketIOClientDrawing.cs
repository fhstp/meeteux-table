﻿using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using Quobject.SocketIoClientDotNet.Client;
using Newtonsoft.Json;

public class SocketIOClientDrawing : MonoBehaviour 
{
	public const string serverURL = "http://localhost:3000";
	protected Socket socket = null;
	public DrawManager manager;
	public Text connectionText;

	private string status;

	// Use this for initialization
	void Start () 
	{
		openConnection ();
		this.status = "Trying to connect to " + serverURL;
	}

	// Update is called once per frame
	void Update () 
	{
		connectionText.text = status;
	}

	void Destroy () 
	{
		closeConnection ();
	}

	void openConnection()
	{
		if (socket != null)
			return;

		socket = IO.Socket (serverURL);

		socket.On ("connected", (data) => {
			Debug.Log(data);
			socket.Emit("connectClient");
			this.status = "Connected";

			attachListener();
		});

	}

	void closeConnection()
	{
		if (socket != null) 
		{
			socket.Disconnect ();
			socket = null;
		}
	}

	void attachListener()
	{
		socket.On ("receiveDrawingData", (data) => {

			string str = data.ToString();
			Drawing result = JsonConvert.DeserializeObject<Drawing> (str);
			this.manager.updateData(result);
		});
	}
}