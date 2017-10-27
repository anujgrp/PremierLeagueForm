$(document).ready(function() {

    //GLOBAL VARS
    var CHART_HEIGHT = 400,
        CHART_WIDTH = 1000,
        MARGIN = 60,
        ROLL = 10,
        X_SCALE = d3.scaleLinear()
            .domain([1, 38])
            .rangeRound([MARGIN, CHART_WIDTH-MARGIN]),
        Y_SCALE  = d3.scaleLinear()
            .domain([0, 3])
            .range([CHART_HEIGHT-MARGIN, MARGIN]),
        TEAMS = ["AFC Bournemouth", "Arsenal FC", "Aston Villa FC", "Brighton & Hove Albion", "Burnley FC", "Chelsea FC", "Crystal Palace FC", "Everton FC", "Huddersfield Town", "Hull City FC", "Leicester City FC", "Liverpool FC", "Manchester City FC", "Manchester United FC", "Middlesbrough FC", "Newcastle United FC", "Norwich City FC", "Southampton FC", "Stoke City FC", "Sunderland AFC", "Swansea City FC", "Tottenham Hotspur FC", "Watford FC", "West Bromwich Albion FC", "West Ham United FC"],
        COLORS = ["black", "blue", "darkblue", "gold", "gray", "green", "maroon", "orange", "purple", "red", "skyblue"],
        SEASONS = ["2017/18", "2016/17", "2015/16"];
    var gTeamKey = [],
        yAxisText = "Average Points Taken From Last " + ROLL + " Games";
        tickz = 4;
        vertY1 = 0;
        vertY2 = 3,
        y = yScalePoints;

    //initialize
    function init() {
        drawChart();
        addOptions();
    }
    init();

    /**
     * D3 DRAWING
     */
    //tooltip
    function tooltip(){
        return d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("font-size", ".75em")
            .style("text-align", "center")
            .style("pointer-events", "none")
            .style("position", "absolute")
            .style("display", "inline-block")
            .style("opacity", 0)
            .style("padding", "2px")
            .style("background", "white")
            .style("border-radius", "8px"); 
    }
    function drawChart() {
        //draw chart background
        var chart = d3.select(".line-chart")
            .attr("height", CHART_HEIGHT)
            .attr("width", CHART_WIDTH)
            .style("background", "#f4f4f4");
        
        //header
        chart.append("text")
            .attr("transform", "translate(" + (CHART_WIDTH/2) + " ," + 20 + ")")
            .style("text-anchor", "middle")
            .style("font-size", "1.25em")
            .text("Premier League Form");
        
        //display x axis and label
        var xAxis = d3.axisBottom(X_SCALE);
        chart.append("g").attr("class", "x axis").attr("transform", "translate(0, "+ (CHART_HEIGHT-MARGIN) +")").call(xAxis);
        chart.append("text")             
            .attr("transform", "translate(" + (CHART_WIDTH/2) + " ," + (CHART_HEIGHT - 18) + ")")
            .style("text-anchor", "middle")
            .text("Matchday");
        //display y axis and label
        var yAxis = d3.axisLeft(Y_SCALE);
        yAxis.ticks(tickz);
        chart.append("g").attr("class", "y axis").attr("transform", "translate(" + MARGIN + ", 0)").call(yAxis);
        chart.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 10)
            .attr("x", 0 - (CHART_HEIGHT / 2))
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text(yAxisText); 

        // watermark
        // chart.append("text")             
        //     .attr("transform", "translate(" + (CHART_WIDTH-135) + " ," + (CHART_HEIGHT - 67) + ")")
        //     .style("text-anchor", "right")
        //     .style("font-size", ".75em")
        //     .text("@space_behind");
    }
    //change chart type based on select value
    function changeChart() {
        var cs = document.getElementById("chart-select");
        var rs = document.getElementById("roll-select");
        var chart = cs.value;
        var roll = +rs.value;
        ROLL = roll;
        if (chart == "pos") {
            d3.select(".line-chart").remove();
            Y_SCALE = d3.scaleLinear()
                .domain([0, 3])
                .range([CHART_HEIGHT-MARGIN, MARGIN]);
            yAxisText = "League Position";
            tickz = 0;
            vertY1 = 0;
            vertY2 = 3;
            ROLL = 38;
            y = yScalePoints;
            d3.select(document.body).insert("svg",":first-child").attr("class", "line-chart");
            drawChart();
        } else if (chart == "pts") {
            d3.select(".line-chart").remove();
            Y_SCALE = d3.scaleLinear()
                .domain([0, 3])
                .range([CHART_HEIGHT-MARGIN, MARGIN]);
            yAxisText = "Average Points Taken From Last " + ROLL + " Games";
            tickz = 4;
            vertY1 = 0;
            vertY2 = 3;
            y = yScalePoints;
            d3.select(document.body).insert("svg",":first-child").attr("class", "line-chart");
            drawChart();
        } else if (chart == "gd") {
            d3.select(".line-chart").remove();
            Y_SCALE  = d3.scaleLinear()
                .domain([-3, 3])
                .range([CHART_HEIGHT-MARGIN, MARGIN]);
            yAxisText = "Average Goal Difference From Last " + ROLL + " Games";
            tickz = 7;
            vertY1 = -3;
            vertY2 = 3;
            y = yScaleGD;
            d3.select(document.body).insert("svg",":first-child").attr("class", "line-chart");
            drawChart();
        } else {
            console.log("chart type does not exist");
        }
        //clear out gTeamKey array
        gTeamKey = [];
    }

    //draw line based on data with appropriate color
    function drawLine(team, season, data, color) {
        var name = team.name,
            abbr = team.abbr;
        //path function
        var line = d3.line()
            .curve(d3.curveLinear)
            .x(function(d,i) { return X_SCALE(i+1); })
            .y(function(d,i) { return y(name, data, i, ROLL); });
        var id = "#" + abbr + "-" + season;
        var dotid = id + "-dot";
        var lineid = id + "-path";
        //draw actual path/line with data
        d3.select(".line-chart")
            .append("path")
            .attr("id", abbr + "-" + season + "-path")
            .attr("class", "team-form")
            .attr("d", line(data))
            .attr("stroke", color)
            .attr("stroke-width", 3)
            .attr("fill", "none")
            .on("mouseover", function(d) { 
                    d3.select(this).moveToFront().style("stroke-width", "5");
                    d3.select(dotid).moveToFront().selectAll("circle").attr("r", 5); 
                })
            .on("mouseout", function(d) { 
                    d3.select(this).style("stroke-width", "3");
                    d3.select(dotid).selectAll("circle").attr("r", 3); 
                });
        //circles for tooltips
        d3.select(".line-chart").append("g")
            .attr("class", "dot")
            .attr("id", abbr + "-" + season + "-dot")
            .selectAll("circle")
            .data(data)
            .enter().append("circle")
                .attr("cx", function(d, i) { return X_SCALE(i+1); })
                .attr("cy", function(d, i) { return y(name, data, i, ROLL); })
                .attr("r", 3)
                .style("fill", "white")
                .style("stroke", color)
                .on("mouseover", function(d,i) {
                        d3.select(this).attr("r", 6).style("fill", color);
                        d3.select(lineid).style("stroke-width", 6);
                        var tt = tooltip();
                        tt.transition()
                            .duration(200)
                            .style("opacity", .9)
                            .style("border", "1px " + color + " solid")
                        tt.html("<table><tr><td>" + getAbbr(d.homeTeamName) + "</td><td>" + d.result.goalsHomeTeam + "</td></tr><tr><td>" + getAbbr(d.awayTeamName) + "</td><td>" + d.result.goalsAwayTeam + "</td></tr></table>")
                            .style("left", X_SCALE(i+1)-15 + "px")
                            .style("top", y(name, data, i, ROLL)-35 + "px");
                    })
                .on("mouseout", function(d) {
                        d3.select(this).attr("r", 3).style("fill", "white");
                        d3.select(lineid).style("stroke-width", "3");
                        d3.selectAll(".tooltip").remove();
                    });
    }

    //draw vertical dashed line at specified matchday
    function drawVertLine() {
        var ms = document.getElementById("matchday-select");
        var cms = document.getElementById("color-md-select");
        var color = cms.value;
        var matchday = ms.value;
        d3.select(".line-chart").append("line")
            .attr("class", "vert-line")
            .style("stroke", color)
            .style("stroke-width", 2)  
            .style("stroke-dasharray", ("3, 3"))
            .attr("x1", X_SCALE(matchday))
            .attr("y1", Y_SCALE(vertY1))      
            .attr("x2", X_SCALE(matchday))
            .attr("y2", Y_SCALE(vertY2))
            .moveToBack()
            .on("dblclick", function(d) { d3.select(this).remove(); });
    }
    //delete line and key from chart
    function deleteTeam(team) {
        //get values from team object
        var abbr = team.name;
        var season = team.season;
        //get the index in gTeamKey of the team to be deleted
        var index = getIndex(abbr, season);
        //delete team from gTeamKey
        gTeamKey.splice(index, 1);
        //format ids from extracted values
        var id = "#" + abbr + "-" + season;
        var idLine = id + "-path";
        var idDot = id + "-dot";
        //remove line and dots from chart
        d3.select(idLine).remove();
        d3.select(idDot).remove();
        //remove all keys
        d3.select(".line-chart").selectAll(".team-key").remove();
        //refresh key with deleted key removed
        displayAllKeys(); 
    }
    //delete all lines and keys
    function deleteAllTeams() {
        //delete all lines and dots
        d3.select(".line-chart").selectAll(".team-form").remove();
        d3.select(".line-chart").selectAll(".vert-line").remove();
        d3.select(".line-chart").selectAll(".dot").remove();
        //delete all keys
        //remove all select options from delete line select
        $(".tk").remove();
        //clear out gTeamKey array
        gTeamKey = [];
        //remove all keys in upper right
        d3.select(".line-chart").selectAll(".team-key").remove();
    }
    //get the index of the line in gTeamKey
    function getIndex(abbr, season) {
        for (k in gTeamKey) {
            var key = gTeamKey[k];
            if (key.name == abbr && key.season == season) {
                return k;
            }
        }
    }
    //add ability to move element to front or back
    d3.selection.prototype.moveToFront = function() {  
        return this.each(function(){
          this.parentNode.appendChild(this);
        });
      };
    d3.selection.prototype.moveToBack = function() {  
        return this.each(function() { 
            var firstChild = this.parentNode.firstChild; 
            if (firstChild) { 
                this.parentNode.insertBefore(this, firstChild); 
            } 
        });
    };

    //display all keys in gTeamKey array
    function displayAllKeys() {
        for (k in gTeamKey) {
            displayKey(k);
        }
    }
    //display a key from gTeamKey array with the corresponding index
    function displayKey(index) {       
        var chart = d3.select(".line-chart");
        var team = gTeamKey[index];
        var id = "#" + team.name + "-" + team.season;
        var lineid = id + "-path";
        var dotid = id + "-dot";
        //write team abbr, season, and a delete line option
        var keyGroup = chart.append("g")
            .attr("class", "team-key")
            .on("mouseover", function(d) {
                    d3.select(lineid).style("stroke-width", "5").moveToFront();
                    d3.select(dotid).moveToFront().selectAll("circle").attr("r", 5);
                })
            .on("mouseout", function(d) {
                    d3.select(lineid).style("stroke-width", "3");
                    d3.select(dotid).selectAll("circle").attr("r", 3);
                });
        keyGroup.append("text")
            .attr("transform", "translate(" + (CHART_WIDTH-MARGIN-60) + " ," + (((+index+1)*15)-0) + ")")
            .style("text-anchor", "right")
            .style("font-size", "0.75em")
            .text(team.name + " (" + team.season.substr(team.season.length-2) + "/" + (+team.season.substr(team.season.length-2) + 1) + ")");
        keyGroup.append("rect")
            .attr("width", "10px")
            .attr("height", "5px")
            .attr("x", CHART_WIDTH-MARGIN-75)
            .attr("y", ((+index+1)*15)-6)
            .style("fill", team.color);
        keyGroup.append("text")
            .attr("transform", "translate(" + (CHART_WIDTH-MARGIN+10) + " ," + (((+index+1)*15)+1) + ")")
            .style("text-anchor", "right")
            .style("font-size", ".9em")
            .html(function(d) { return "X"; })
            .on("click", function(d) {
                    d3.select(this).remove();
                    deleteTeam(team);
                });
    }
    //add team to key in upper right
    function addKey(name, season, color) {
        //push team key into gTeamKey array
        gTeamKey.push({"name": name, "season": season, "color": color});
        //add team-key class to option
        $("#key-select option").addClass("tk");
        //display the most recent key in the array (the one we just pushed)
        displayKey(gTeamKey.length-1);
    }



    /**
     * OPTIONS FOR SELECTING A TEAM TO DRAW A LINE FOR
     */
    //add in options for teams, seasons, and colors
    function addOptions() {
        var ts = document.getElementById("team-select");
        var ss = document.getElementById("season-select");
        var cs = document.getElementById("color-select");
        var cms = document.getElementById("color-md-select");
        var ms = document.getElementById("matchday-select");
        for (t in TEAMS) {
            var team = TEAMS[t];
            var option = document.createElement("option");
            option.text = team;
            ts.add(option);
        }
        for (s in SEASONS) {
            var season = SEASONS[s];
            var option = document.createElement("option");
            option.text = season;
            ss.add(option);
        }
        for (c in COLORS) {
            var color = COLORS[c];
            var option = document.createElement("option");
            option.text = color;
            cs.add(option);
        }
        for (c in COLORS) {
            var color = COLORS[c];
            var option = document.createElement("option");
            option.text = color;
            cms.add(option);
        }
        for (var i=0; i < 38; i++) {
            var option = document.createElement("option");
            option.text = i+1;
            ms.add(option);
        }
        
    }
    //add team based on selections
    function addTeam() {
        //get value from each select
        var ts = document.getElementById("team-select");
        var ss = document.getElementById("season-select");
        var cs = document.getElementById("color-select");
        var name = ts.value;
        var season = ss.value;
        var color = cs.value;
        //get team from pl teams based on select
        var team;
        for (i in pl.teams) {
            var t = pl.teams[i];
            if (t.name == name) {
                team = t;
            }
        }
        //get data and draw line
        teamSelected(team, pl, season.substr(0,4), color);       
    }

    
    //add onclick events for buttons
    document.getElementById("chart-btn").onclick = function() {changeChart()};
    document.getElementById("options-btn").onclick = function() {addTeam()};
    document.getElementById("delete-all-btn").onclick = function() {deleteAllTeams()};
    document.getElementById("matchday-line-btn").onclick = function() {drawVertLine()};





    /**
     * DATA RETRIEVAL
     */
    //get data from api, draw line on chart, add team to key
    function teamSelected(team, competition, season, color) {
        var req = "http://api.football-data.org/v1/teams/" + team.id + "/fixtures?season=" + season;
        $.ajax({
            headers: {"X-Auth-Token": "21c85df4425f47eebd9ba847693e9094"},
            url: req,
            dataType: 'json',
            type: 'GET',
        }).done(function(data) {
                //get fixtures by competition
                var fixtures = getFixturesByCompetition(data.fixtures, competition.id[season]);
                //draw the line for the team based on data
                drawLine(team, season, fixtures, color);
                //draw the key
                addKey(team.abbr, season, color);
            })
            .fail(function(err) {
                console.log(req);
                alert("Error retrieving data, please try again!");
            });
    }


    /**
     * DATA MANIPULATION
     */
    //filter fixtures by their competition, and their completion status
    function getFixturesByCompetition(fixtures, compid) {
        return fixtures.filter(function(f) {
            return f._links.competition.href === compid && f.status === "FINISHED";
        });
    }

    //return 3 letter abbreviation when given full name of team
    function getAbbr(name) {
        for (t in pl.teams) {
            team = pl.teams[t];
            if (team.name == name) {
                return team.abbr;
            }
        }
        console.log("Team name not found");
    }
    
    //takes team, list of fixtures, index, and number of fixtures to keep as rolling average
    //returns y value for that index in the fixtures based on average points
    function yScalePoints(team, fixtures, index, roll) {
        //figure out oldest fixture from fixtures still included in the rolling average
        var oldestFixture = (index+1)-roll;
        if (oldestFixture < 0) {
            oldestFixture = 0;
        }
        //only take fixtures that start at oldest fixture up to and including the current index
        var f = fixtures.slice(oldestFixture, index+1);
        var avg = avgPoints(team, f);
        return Y_SCALE(avg);
    }

    //takes team and list of fixtures
    //returns average points from fixtures 
    function avgPoints(team, fixtures) {
        var sum = 0;
        for (f in fixtures) {
            var fixture = fixtures[f];
            sum += points(team, fixture);
        }
        var avg = sum / fixtures.length;
        return avg;
    }
    
    //takes a fixture object and team name
    //returns 3 for win, 1 for draw, 0 for loss
    function points(team, fixture) {
        var points = 0;
        var homeTeam = fixture.homeTeamName,
            awayTeam = fixture.awayTeamName,
            homeScore = fixture.result.goalsHomeTeam,
            awayScore = fixture.result.goalsAwayTeam;

        if (homeTeam == team) {
            if (homeScore > awayScore) {
                points = 3;
            } else if (homeScore == awayScore) {
                points = 1;
            } else {
                points = 0;
            }
        } else if (awayTeam == team) {
            if (awayScore > homeScore) {
                points = 3;
            } else if (awayScore == homeScore) {
                points = 1;
            } else {
                points = 0;
            }
        } else {
            console.log("Error calculating points from fixture: team does not exist in this fixture");
            return -1;
        }
        return points;
    }
    //takes team, list of fixtures, index, and number of fixtures to keep as rolling average
    //returns y value for that index in the fixtures based on average goal difference
    function yScaleGD(team, fixtures, index, roll) {
        //figure out oldest fixture from fixtures still included in the rolling average
        var oldestFixture = (index+1)-roll;
        if (oldestFixture < 0) {
            oldestFixture = 0;
        }
        //only take fixtures that start at oldest fixture up to and including the current index
        var f = fixtures.slice(oldestFixture, index+1);
        var avg = avgGD(team, f);
        return Y_SCALE(avg);
    }

    //average goal difference of team in list of fixtures
    function avgGD(team, fixtures) {
        var sum = 0;
        for (f in fixtures) {
            var fixture = fixtures[f];
            sum += goalDiff(team, fixture);
        }
        var avg = sum / fixtures.length;
        return avg;
    }
    //get the goal difference of the team in the fixture
    function goalDiff(team, fixture) {
        var diff = 0;
        var homeTeam = fixture.homeTeamName,
        awayTeam = fixture.awayTeamName,
        homeScore = fixture.result.goalsHomeTeam,
        awayScore = fixture.result.goalsAwayTeam;

        if (homeTeam == team) {
            diff = homeScore - awayScore;
        } else if (awayTeam == team) {
            diff = awayScore - homeScore;
        } else {
            console.log("Error calculating points from fixture: team does not exist in this fixture");
            return -1;
        }
        return diff;
    }
    

});