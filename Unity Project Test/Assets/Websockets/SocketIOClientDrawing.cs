using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using Quobject.SocketIoClientDotNet.Client;
using Newtonsoft.Json;
using System;

public class SocketIOClientDrawing : MonoBehaviour 
{
	public const string serverURL = "http://localhost:8100";
	protected Socket socket = null;
	public DrawManager manager;
	public Text connectionText;
	public Text dataText;

	private bool connected = false;

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

		socket.Listeners("receiveDrawingData").Clear();

		socket.On ("connected", (data) => {
			//Debug.Log(data);
			socket.Emit("connectClient");
			this.status = "Connected";

			if(!connected)
			{
				connected = true;
				attachListener();
			}
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
			//Debug.Log(data);
			string str = data.ToString();
			Drawing result = JsonConvert.DeserializeObject<Drawing> (str);
			this.manager.updateData(result);
		});

		socket.On ("receiveBigData", (data) => {
			string str = data.ToString();
			BigData result = JsonConvert.DeserializeObject<BigData> (str);

			DateTime now = System.DateTime.Now;
			TimeSpan span = now.Subtract(result.timestamp);

			dataText.text = "Received Big Data. Time: " + span.Seconds + " sec";

			Debug.Log("Received Big Data. Time: " + span.Seconds + " sec");
		});
	}
}
