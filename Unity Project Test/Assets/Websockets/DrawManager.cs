using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class DrawManager : MonoBehaviour {

	public GameObject linePrefab;
	private Dictionary<string, LineRenderer> drawings;
	private List<Drawing> data;
	public Button resetButton;

	private Color red = new Color (1,0.47f,0.47f);
	private Color blue = new Color(0.3f,0.54f,0.82f);
	private Color yellow = new Color(1,0.9f,0);
	private Color purple = new Color(0.81f,0.32f,0.8f);
	private Color green = new Color(0.2f,0.83f,0.26f);

	// Use this for initialization
	void Start () {
		this.drawings = new Dictionary<string, LineRenderer> ();
		this.data = new List<Drawing> ();

		Button btn = resetButton.GetComponent<Button>();
		btn.onClick.AddListener(resetData);
	}
	
	// Update is called once per frame
	void Update () 
	{
		List<Drawing> tmpData = new List<Drawing> (data);
		foreach (Drawing d in tmpData) 
		{
			LineRenderer tmp = null;
			// Debug.Log (d.id);
			if (drawings.TryGetValue (d.id, out tmp)) 
			{
				tmp.positionCount++;
				tmp.SetPosition(tmp.positionCount-1, d.pathNode);
			} 
			else 
			{
				this.drawNewLine (d.id, d.pathNode, d.color);
			}
		}
		data.Clear (); 
	}

	public void drawNewLine(string id, Vector3 pathNode, string color)
	{
		GameObject newLine = Instantiate(linePrefab);
		LineRenderer rend = newLine.GetComponent<LineRenderer> ();
		rend.positionCount = 1;
		rend.SetPosition(0, pathNode);

		switch (color) 
		{
			case "blue":
			rend.startColor = blue;
			rend.endColor = blue;
			break;

			case "green":
			rend.startColor = green;
			rend.endColor = green;
			break;

			case "red":
			rend.startColor = red;
			rend.endColor = red;
			break;

			case "yellow":
			rend.startColor = yellow;
			rend.endColor = yellow;
			break;

			case "purple":
			rend.startColor = purple;
			rend.endColor = purple;
			break;
		}

		this.drawings.Add (id, rend);

		newLine.transform.parent = this.transform;
	}

	public void updateData(Drawing drawing)
	{
		this.data.Add (drawing);
	}

	void resetData()
	{
		this.drawings = new Dictionary<string, LineRenderer> ();
		this.data = new List<Drawing> ();

		GameObject[] ds = GameObject.FindGameObjectsWithTag("Lines");

		foreach (GameObject d in ds)
		{
			Destroy (d);
		}
	}
}
