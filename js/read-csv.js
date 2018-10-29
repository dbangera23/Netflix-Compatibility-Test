	var user1Set = new Set();
	var user2Set = new Set();
	var user1EpisodesWatched = 0;
	var user2EpisodesWatched = 0;
	var numOfUniqueEpisodesBothWatched = 0;
	var rollingAvg = 0;
	var rollingAvgSize = 0;
	var firstDataSetDone = false;

	function checkFileInput() {
		if ((document.getElementById("user1File").files.length == 1) &&
			(document.getElementById("user2File").files.length == 1)) {
				document.getElementById("analyzeButton").disabled = false;
				return true;
		} else {
			document.getElementById("analyzeButton").disabled = true;
			return false
		}
	}
	
	function fileAnalyzer(file1, file2) {
		if (checkFileInput()) {
			// FileReader are supported.
			if (window.FileReader) {
				resetData();
				// Read file into memory as UTF-8
				var reader1 = new FileReader();
				reader1.readAsText(file1);
				// Handle errors load
				reader1.onload = loadHandler1;
				reader1.onerror = errorHandler;

				var reader2 = new FileReader();
				reader2.readAsText(file2);
				// Handle errors load
				reader2.onload = loadHandler2;
				reader2.onerror = errorHandler;
			} else {
				alert('Unable to read files on this browser.');
			}
		} else {
			alert("Please provide both files");
		}
	}
	
    function loadHandler1(event) {
		var csv = event.target.result;
		readData(csv, true);
		console.log(user1Set);
		if (firstDataSetDone) {
			AnalyzeData();
			updateViews();
		} else {
			firstDataSetDone = true;
		}
    }
	
	function loadHandler2(event) {
		var csv = event.target.result;
		readData(csv, false);
		console.log(user2Set);
		if (firstDataSetDone) {
			AnalyzeData();
			updateViews();
		} else {
			firstDataSetDone = true;
		}
    }
	
	function updateViews() {
		document.getElementById("compatibilityScore").innerHTML = rollingAvg.toFixed(2).toString() + "%";
		var user1Name = document.getElementById("user1NameInput").value
		var user2Name = document.getElementById("user2NameInput").value
		if (user1Name === "") {
			user1Name = "User 1";
		} 
		if (user2Name === "") {
			user2Name = "User 2";
		}
		document.getElementById("user1Episodes").innerHTML = user1Name + " Unique Episodes";
		document.getElementById("user2Episodes").innerHTML = user2Name + " Unique Episodes";
		document.getElementById("User1Count").innerHTML = user1EpisodesWatched.toString();
		document.getElementById("User2Count").innerHTML = user2EpisodesWatched.toString();
		document.getElementById("UniqueBothCount").innerHTML = numOfUniqueEpisodesBothWatched.toString();
		document.getElementById("userReport").style.visibility='visible'
	}
	
	function AnalyzeData() {
		if (user1Set.size > user2Set.size) {
			user1Set.forEach(function(key) {
				if (user2Set.has(key)) {
					numOfUniqueEpisodesBothWatched++;
					updateRollingAvg(100);
				} else {
					updateRollingAvg(0);
				}
			});
		} else {
			user2Set.forEach(function(key) {
				if (user1Set.has(key)) {
					numOfUniqueEpisodesBothWatched++;
					updateRollingAvg(100);
				} else {
					updateRollingAvg(0);
				}
			});
		}
	}
	
    function readData(csv, user) {
		console.log(user);
        var allTextLines = csv.split(/\r\n|\n/);
        for (var i=1; i<allTextLines.length-1; i++) {
            var data = allTextLines[i].substring(0,allTextLines[i].lastIndexOf(","));
			if (user) {
				user1Set.add(data);
				user1EpisodesWatched++;
			} else {
				user2Set.add(data);
				user2EpisodesWatched++;
			}
        }
    }
	
	function updateRollingAvg(num) {
		rollingAvg = (rollingAvgSize * rollingAvg + num) / (rollingAvgSize + 1);
		rollingAvgSize++;
	}

	function resetData() {
		rollingAvg = 0;
		rollingAvgSize = 0;
		firstDataSetDone = false;
		numOfUniqueEpisodesBothWatched = 0;
		user1Set.clear();
		user1EpisodesWatched = 0;
		user2Set.clear();
		user2EpisodesWatched = 0;
		updateViews();
	}
	
	function errorHandler(evt) {
		if(evt.target.error.name == "NotReadableError") {
			alert("Cannot read file !");
		}
	}