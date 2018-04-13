using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class DynamicGridLayout : MonoBehaviour {

	public int columns, rows;

	// Use this for initialization
	void Start () {
		RectTransform parent = gameObject.GetComponent<RectTransform> ();
		GridLayoutGroup grid = gameObject.GetComponent<GridLayoutGroup> ();

		grid.cellSize = new Vector2 (parent.rect.width / columns, parent.rect.height / rows);
		
	}
	
	// Update is called once per frame
	void Update () {
		
	}
}
