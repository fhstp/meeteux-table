using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using Quobject.SocketIoClientDotNet.Client;
using Newtonsoft.Json;

public class SocketIOClient : MonoBehaviour 
{
	public const string serverURL = "http://localhost:8100";
	protected Socket socket = null;

	public Text text1;
	public Text text2;
	public Text text3;
	public Text text4;

	private string t1;
	private string t2;
	private string t3;
	private string t4;

	// Use this for initialization
	void Start () 
	{
		openConnection ();
	}
	
	// Update is called once per frame
	void Update () 
	{
		text1.text = t1;
		text2.text = t2;
		text3.text = t3;
		text4.text = t4;
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
		socket.On ("requestDataResult", (data) => {
			
			string str = data.ToString();

			UserResult result = JsonConvert.DeserializeObject<UserResult> (str);

			t1 = "Player 1: unkown";
			t2 = "Player 2: unkown";
			t3 = "Player 3: unkown";
			t4 = "Player 4: unkown";

			for (int i = 0; i < result.users.Length; i++)
			{
				User u = result.users[i];
				switch (i)
				{
					case 0: 
						t1 = "Player1: " + u.name + "\n[" + u.location + "]"; 
						break;
					case 1: 
						t2 = "Player2: " + u.name + "\n[" + u.location + "]";
						break;
					case 2: 
						t3 = "Player3: " + u.name + "\n[" + u.location + "]"; 
						break;
					case 3: 
						t4 = "Player4: " + u.name + "\n[" + u.location + "]";
						break;
				}
			}
		});
	}

	void requestUserData()
	{
		socket.Emit ("requestData");
	}
}
