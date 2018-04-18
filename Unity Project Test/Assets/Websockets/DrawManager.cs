using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class DrawManager : MonoBehaviour {

	public GameObject linePrefab;
	private Dictionary<int, LineRenderer> drawings;
	private List<Drawing> data;

	// Use this for initialization
	void Start () {
		this.drawings = new Dictionary<int, LineRenderer> ();
		this.data = new List<Drawing> ();
	}
	
	// Update is called once per frame
	void Update () 
	{
		foreach (Drawing d in data) 
		{
			LineRenderer tmp = null;
			if (drawings.TryGetValue (d.id, out tmp)) 
			{
				tmp.positionCount = d.pathNodes.Length;
				tmp.SetPositions (d.pathNodes);
			} 
			else 
			{
				this.drawNewLine (d.id, d.pathNodes);
			}
		}
	}

	public void drawNewLine(int id, Vector3[] pathNodes)
	{
		GameObject newLine = Instantiate(linePrefab);
		LineRenderer rend = newLine.GetComponent<LineRenderer> ();
		rend.positionCount = pathNodes.Length;
		rend.SetPositions(pathNodes);

		this.drawings.Add (id, rend);

		newLine.transform.parent = this.transform;
	}

	public void updateData(Drawing drawing)
	{
		this.data.Add (drawing);
	}
}
