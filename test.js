let charData = {
}
let episodesData = [
    {
        "name": "Getting Teardrop to Talk"
    },
    {
        "name": "Lick Your Way to Freedom"
    },
    {
        "name": "Why Would You Do This on a Swingset?"
    },
    {
        "name": "Today's Very Special Episode"
    },
    {
        "name": "Fortunate Ben"
    },
    {
        "name": "Four Goes Too Far"
    },
    {
        "name": "The Liar Ball You Don't Want"
    },
    {
        "name": "Questions Answered"
    },
    null,
    {
        "name": "Getting Teardrop to Talk"
    },
    {
        "name": "Getting Teardrop to Talk"
    },
]

for(var i = 0; i < episodesData.length; i++) {
    if(i == 8) {
        episodesData[i].name = "This Episode is About " + charData.basketball.name;
    }
    console.log(episodesData[i].name);
}