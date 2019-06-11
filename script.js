/*
Saved my ass: https://blog.logrocket.com/binary-data-in-the-browser-untangling-an-encoding-mess-with-javascript-typed-arrays-119673c0f1fe
Used Plugins/Libraries:
    - voca (String Utility)
    - jsmidgen (jsMidi Utility)
    - download (Download Utility)
 */
let areChords = false;
let qualityNR = -1;
let preset = false;




function createMidi(){
    let genomeString = document.getElementById("genome").value;
    genomeString = v.lowerCase(genomeString);
    let numberSequence = v.replaceAll(v.replaceAll(v.replaceAll(v.replaceAll(genomeString,'t','3'),'g','2'),'c','1'),'a','0');
    let amount = v.count(numberSequence);
    let scale = v.slice(numberSequence,0,5);
    let baseNote = Math.round((parseInt(v.slice(scale,0,3),4)/4) + 36) + parseInt(document.getElementById("transposeKey").value,10);
    let scaleQuality = qualityNR ;
    if(qualityNR === -1){
        scaleQuality = Math.round(parseInt(v.slice(scale,3,5),4)/2);
    }
    let notes = [];
    let scaleTonalSteps = [0,2,4,5,7,9,11,12,14,16,17,19,21,23,24,26]; //IONIAN
    switch(scaleQuality){
        case 1:
            scaleTonalSteps = [0,2,3,5,7,9,10,12,14,15,17,19,21,22,24,26]; //DORIAN
            break;
        case 2:
            scaleTonalSteps = [0,1,3,5,7,8,10,12,13,15,17,19,20,22,24,25]; //PHRYGIAN
            break;
        case 3:
            scaleTonalSteps = [0,2,4,6,7,9,11,12,14,16,18,19,21,23,24,26]; //LYDIAN
            break;
        case 4:
            scaleTonalSteps = [0,2,4,5,7,9,10,12,14,16,17,19,21,22,24,26]; //MIXOLYDIAN
            break;
        case 5:
            scaleTonalSteps = [0,2,3,5,7,8,10,12,14,15,17,19,20,22,24,26]; //AEOLIAN
            break;
        case 6:
            scaleTonalSteps = [0,1,3,5,6,8,10,12,13,15,17,18,20,22,24,26]; //LOCRIAN
            break;

    }
    for(let i = 2; i * 5 < amount; i++){
        notes.push(v.slice(numberSequence,(i-1)*5,i*5));
    }
    let file = new jsMidi.File();
    let track = new jsMidi.Track();
    let bpm = parseInt(document.getElementById("bpm").value,10);
    if(document.getElementById("bpm").value == '') stepLength=parseInt(v.slice(scale,0,3),4);
    track.setTempo(parseInt(v.slice(scale,0,3),4));
    let singlenote = !areChords;
    let chordamount = parseInt(document.getElementById("chordAmount").value,10);
    let stepLength = parseInt(document.getElementById("stepLength").value,10);
    if(document.getElementById("stepLength").value == '') stepLength=128;



    if(singlenote){
        for(let i = 0; i < notes.length; i++){
            let sign = Math.sign(parseInt(v.slice(notes[i],4,5),4)-2);
            let noteNR = (baseNote+sign*scaleTonalSteps[parseInt(v.slice(notes[i],0,2),4)]);
            let vel = Math.round(((parseInt(v.slice(notes[i],2,4),4)+1)/16)*90)+20;
            let length = parseInt(v.slice(notes[i],4,5),4)+1;
            track.addNote(0,noteNR,length*stepLength-1,1,vel);
        }
    }else{
        let i = chordamount;
        while(i < notes.length)
        {
            let chord = [];
            let vel = 0;
            let length = 0;
            for(let j = 0; j < chordamount; j++){
                length = parseInt(v.slice(notes[i-j],4,5),4)+1;
                let sign = Math.sign(parseInt(v.slice(notes[i-j],4,5),4)-2);
                chord.push(baseNote+sign*scaleTonalSteps[parseInt(v.slice(notes[i-j],0,2),4)]);
                vel = Math.round(((parseInt(v.slice(notes[i-j],2,4),4)+1)/16)*90)+20;
            }
            track.addChord(0,chord, length*stepLength, vel);
            i=i+chordamount;
            //track.addNote(0,noteNR,64,0,vel);
        }
    }

    file.addTrack(track);
    let bytes = file.toBytes();
    let u8 = new Uint8Array(bytes.length);
    for(let i=0;i<bytes.length;i++){
        u8[i] = bytes[i].charCodeAt(0);
    }

    let blob = new Blob([u8],{type:'audio/midi'});
    download(blob,'genome.mid','audio/midi');
}

function playGenome(){
    let genomeString = document.getElementById("genome").value;
    genomeString = v.lowerCase(genomeString);
    let numberSequence = v.replaceAll(v.replaceAll(v.replaceAll(v.replaceAll(genomeString,'t','3'),'g','2'),'c','1'),'a','0');
    let amount = v.count(numberSequence);
    let scale = v.slice(numberSequence,0,5);
    let baseNote = Math.round((parseInt(v.slice(scale,0,3),4)/4) + 36) + parseInt(document.getElementById("transposeKey").value,10);
    let scaleQuality = Math.round(parseInt(v.slice(scale,3,5),4)/2);
    if(document.getElementById("quality?").checked){
        scaleQuality = parseInt(document.getElementById("scaleQuality").value,10);
    }
    alert(baseNote+" "+scaleQuality);
    let notes = [];
    let scaleTonalSteps = [0,2,4,5,7,9,11,12,14,16,17,19,21,23,24,26]; //IONIAN
    switch(scaleQuality){
        case 1:
            scaleTonalSteps = [0,2,3,5,7,9,10,12,14,15,17,19,21,22,24,26]; //DORIAN
            break;
        case 2:
            scaleTonalSteps = [0,1,3,5,7,8,10,12,13,15,17,19,20,22,24,25]; //PHRYGIAN
            break;
        case 3:
            scaleTonalSteps = [0,2,4,6,7,9,11,12,14,16,18,19,21,23,24,26]; //LYDIAN
            break;
        case 4:
            scaleTonalSteps = [0,2,4,5,7,9,10,12,14,16,17,19,21,22,24,26]; //MIXOLYDIAN
            break;
        case 5:
            scaleTonalSteps = [0,2,3,5,7,8,10,12,14,15,17,19,20,22,24,26]; //AEOLIAN
            break;
        case 6:
            scaleTonalSteps = [0,1,3,5,6,8,10,12,13,15,17,18,20,22,24,26]; //LOCRIAN
            break;

    }
    for(let i = 2; i * 5 < amount; i++){
        notes.push(v.slice(numberSequence,(i-1)*5,i*5));
    }
    let file = new jsMidi.File();
    let track = new jsMidi.Track();
    track.setTempo(parseInt(v.slice(scale,0,3),4));
    let singlenote = !document.getElementById("chords?").checked;
    let chordamount = parseInt(document.getElementById("chordAmount").value,10);
    let stepLength = parseInt(document.getElementById("stepLength").value,10);
    if(singlenote){
        for(let i = 0; i < notes.length; i++){
            let sign = Math.sign(parseInt(v.slice(notes[i],4,5),4)-2);
            let noteNR = (baseNote+sign*scaleTonalSteps[parseInt(v.slice(notes[i],0,2),4)]);
            let vel = Math.round(((parseInt(v.slice(notes[i],2,4),4)+1)/16)*90)+20;
            let length = parseInt(v.slice(notes[i],4,5),4)+1;
            track.addNote(0,noteNR,length*stepLength-1,1,vel);
        }
    }else{
        let i = chordamount;
        while(i < notes.length)
        {
            let chord = [];
            let vel = 0;
            let length = 0;
            for(let j = 0; j < chordamount; j++){
                length = parseInt(v.slice(notes[i-j],4,5),4)+1;
                let sign = Math.sign(parseInt(v.slice(notes[i-j],4,5),4)-2);
                chord.push(baseNote+sign*scaleTonalSteps[parseInt(v.slice(notes[i-j],0,2),4)]);
                vel = Math.round(((parseInt(v.slice(notes[i-j],2,4),4)+1)/16)*90)+20;
            }
            track.addChord(0,chord, length*stepLength, vel);
            i=i+chordamount;
            //track.addNote(0,noteNR,64,0,vel);
        }
    }

    file.addTrack(track);
    let bytes = file.toBytes();
    let u8 = new Uint8Array(bytes.length);
    for(let i=0;i<bytes.length;i++){
        u8[i] = bytes[i].charCodeAt(0);
    }

    let blob = new Blob([u8],{type:'audio/midi'});
    const midi = new Midi(bytes);
    const synths = [];
//the file name decoded from the first track
    const name = midi.name;
//get the tracks
    midi.tracks.forEach(track => {
        //tracks have notes and controlChanges
        const synth = new Tone.PolySynth(10, Tone.Synth, {
            envelope : {
                attack : 0.02,
                decay : 0.1,
                sustain : 0.3,
                release : 1
            }
        }).toMaster();
        synths.push(synth);
        //notes are an array
        const notes = track.notes;
        notes.forEach(note => {
            synth.triggerAttackRelease(note.name, note.duration, note.time + now, note.velocity);
        })
    })
}

function playGenomeold(){
    let genomeString = document.getElementById("genome").value;
    genomeString = v.lowerCase(genomeString);
    let numberSequence = v.replaceAll(v.replaceAll(v.replaceAll(v.replaceAll(genomeString,'t','3'),'g','2'),'c','1'),'a','0');
    let amount = v.count(numberSequence);
    let scale = v.slice(numberSequence,0,5);
    let baseNote = Math.round((parseInt(v.slice(scale,0,3),4)/4) + 36) + parseInt(document.getElementById("transposeKey").value,10);
    let scaleQuality = Math.round(parseInt(v.slice(scale,3,5),4)/2);
    if(document.getElementById("quality?").checked){
        scaleQuality = parseInt(document.getElementById("scaleQuality").value,10);
    }
    alert(baseNote+" "+scaleQuality);
    let notes = [];
    let scaleTonalSteps = [0,2,4,5,7,9,11,12,14,16,17,19,21,23,24,26]; //IONIAN
    switch(scaleQuality){
        case 1:
            scaleTonalSteps = [0,2,3,5,7,9,10,12,14,15,17,19,21,22,24,26]; //DORIAN
            break;
        case 2:
            scaleTonalSteps = [0,1,3,5,7,8,10,12,13,15,17,19,20,22,24,25]; //PHRYGIAN
            break;
        case 3:
            scaleTonalSteps = [0,2,4,6,7,9,11,12,14,16,18,19,21,23,24,26]; //LYDIAN
            break;
        case 4:
            scaleTonalSteps = [0,2,4,5,7,9,10,12,14,16,17,19,21,22,24,26]; //MIXOLYDIAN
            break;
        case 5:
            scaleTonalSteps = [0,2,3,5,7,8,10,12,14,15,17,19,20,22,24,26]; //AEOLIAN
            break;
        case 6:
            scaleTonalSteps = [0,1,3,5,6,8,10,12,13,15,17,18,20,22,24,26]; //LOCRIAN
            break;

    }
    for(let i = 2; i * 5 < amount; i++){
        notes.push(v.slice(numberSequence,(i-1)*5,i*5));
    }
    let singlenote = !document.getElementById("chords?").checked;
    let chordamount = parseInt(document.getElementById("chordAmount").value,10);
    let stepLength = parseInt(document.getElementById("stepLength").value,10);
    Tone.Transport.bpm.value = Math.round(120*parseInt(v.slice(scale,0,3),4)/93);

    stepLength = Tone.Time('16n');
    if(singlenote){
        let synth = new Tone.Synth({
            oscillator: {
                type: 'triangle'
            },
            envelope: {
                attack: 1.0,
                decay: 2.0,
                sustain: 0.8,
                release: 0.1
            }
        }).toMaster();
        let globalTime = Tone.now()+0.5;
        for(let i = 0; i < notes.length; i++){

            let sign = Math.sign(parseInt(v.slice(notes[i],4,5),4)-2);
            let noteNR = (baseNote+sign*scaleTonalSteps[parseInt(v.slice(notes[i],0,2),4)]);
            let vel = Math.round(((parseInt(v.slice(notes[i],2,4),4)+1)/16)*90)+20;
            let length = parseInt(v.slice(notes[i],4,5),4)+1;
            function triggerSynth(time){
                synth.triggerAttackRelease(Tone.Frequency(noteNR,"midi").toNote(), Tone.Time(stepLength.valueOf()*length), time,vel);
            }
            Tone.Transport.schedule(triggerSynth, Tone.Time(globalTime));
            globalTime += Tone.Time(stepLength.valueOf()*length);

        }
        Tone.Transport.loopEnd = '1m';
        Tone.Transport.loop = true;
        Tone.Transport.start();
    }else{

        let synth = new Tone.PolySynth(16,Tone.Synth,{
            oscillator: {
                type: 'triangle'
            },
            envelope: {
                attack: 1.0,
                decay: 2.0,
                sustain: 0.8,
                release: 0.1
            }
        }).toMaster();
        synth.volume = -3;
        let globalTime = Tone.now()+0.5;
        let i = chordamount;
        while(i < notes.length)
        {
            let chord = [];
            let vel = 0;
            let length = 0;
            for(let j = 0; j < chordamount; j++){
                length = parseInt(v.slice(notes[i-j],4,5),4)+1;
                let sign = Math.sign(parseInt(v.slice(notes[i-j],4,5),4)-2);
                chord.push(Tone.Frequency(baseNote+sign*scaleTonalSteps[parseInt(v.slice(notes[i-j],0,2),4)],"midi"));
                vel = Math.round(((parseInt(v.slice(notes[i-j],2,4),4)+1)/16)*90)+20;
            }
            function triggerSynth2(time){
                synth.triggerAttackRelease(chord, Tone.Time(Tone.Time(stepLength).valueOf()*length).toNotation(), time,vel);
            }
            Tone.Transport.schedule(triggerSynth2, Tone.Time(globalTime));
            globalTime += Tone.Time(stepLength).valueOf()*length;
            i=i+chordamount;
            //track.addNote(0,noteNR,64,0,vel);
        }
        Tone.Transport.toggle();
    }

}

function clickChords(){
    if(document.getElementById("chordsButton").classList.contains('active')){
        document.getElementById("chordsButton").classList.remove('active');
        areChords = false;
    }else{
        document.getElementById("chordsButton").classList.add('active');
        areChords = true;
    }
}

function clickIonian(){
    if(document.getElementById("ionianButton").classList.contains('active')){
        document.getElementById("ionianButton").classList.remove('active');
        qualityNR = -1;
    }else{
        document.getElementById("ionianButton").classList.add('active');
        qualityNR = 0;
    }

    if(document.getElementById("dorianButton").classList.contains('active')) document.getElementById("dorianButton").classList.remove('active');
    if(document.getElementById("phrygianButton").classList.contains('active')) document.getElementById("phrygianButton").classList.remove('active');
    if(document.getElementById("lydianButton").classList.contains('active')) document.getElementById("lydianButton").classList.remove('active');
    if(document.getElementById("mixolydianButton").classList.contains('active')) document.getElementById("mixolydianButton").classList.remove('active');
    if(document.getElementById("aeolianButton").classList.contains('active')) document.getElementById("aeolianButton").classList.remove('active');
    if(document.getElementById("locrianButton").classList.contains('active')) document.getElementById("locrianButton").classList.remove('active');
}

function clickDorian(){
    if(document.getElementById("dorianButton").classList.contains('active')){
        document.getElementById("dorianButton").classList.remove('active');
        qualityNR = -1;
    }else{
        document.getElementById("dorianButton").classList.add('active');
        qualityNR = 1;
    }
    if(document.getElementById("ionianButton").classList.contains('active')) document.getElementById("ionianButton").classList.remove('active');
    if(document.getElementById("phrygianButton").classList.contains('active')) document.getElementById("phrygianButton").classList.remove('active');
    if(document.getElementById("lydianButton").classList.contains('active')) document.getElementById("lydianButton").classList.remove('active');
    if(document.getElementById("mixolydianButton").classList.contains('active')) document.getElementById("mixolydianButton").classList.remove('active');
    if(document.getElementById("aeolianButton").classList.contains('active')) document.getElementById("aeolianButton").classList.remove('active');
    if(document.getElementById("locrianButton").classList.contains('active')) document.getElementById("locrianButton").classList.remove('active');
}

function clickPhyrigian(){
    if(document.getElementById("phrygianButton").classList.contains('active')){
        document.getElementById("phrygianButton").classList.remove('active');
        qualityNR = -1;
    }else{
        document.getElementById("phrygianButton").classList.add('active');
        qualityNR = 2;
    }
    if(document.getElementById("ionianButton").classList.contains('active')) document.getElementById("ionianButton").classList.remove('active');
    if(document.getElementById("dorianButton").classList.contains('active')) document.getElementById("dorianButton").classList.remove('active');
    if(document.getElementById("lydianButton").classList.contains('active')) document.getElementById("lydianButton").classList.remove('active');
    if(document.getElementById("mixolydianButton").classList.contains('active')) document.getElementById("mixolydianButton").classList.remove('active');
    if(document.getElementById("aeolianButton").classList.contains('active')) document.getElementById("aeolianButton").classList.remove('active');
    if(document.getElementById("locrianButton").classList.contains('active')) document.getElementById("locrianButton").classList.remove('active');
}

function clickLydian(){
    if(document.getElementById("lydianButton").classList.contains('active')){
        document.getElementById("lydianButton").classList.remove('active');
        qualityNR = -1;
    }else{
        document.getElementById("lydianButton").classList.add('active');
        qualityNR = 3;
    }
    if(document.getElementById("ionianButton").classList.contains('active')) document.getElementById("ionianButton").classList.remove('active');
    if(document.getElementById("dorianButton").classList.contains('active')) document.getElementById("dorianButton").classList.remove('active');
    if(document.getElementById("phrygianButton").classList.contains('active')) document.getElementById("phrygianButton").classList.remove('active');
    if(document.getElementById("mixolydianButton").classList.contains('active')) document.getElementById("mixolydianButton").classList.remove('active');
    if(document.getElementById("aeolianButton").classList.contains('active')) document.getElementById("aeolianButton").classList.remove('active');
    if(document.getElementById("locrianButton").classList.contains('active')) document.getElementById("locrianButton").classList.remove('active');
}

function clickMixolydian() {
    if (document.getElementById("mixolydianButton").classList.contains('active')) {
        document.getElementById("mixolydianButton").classList.remove('active');
        qualityNR = -1;
    } else {
        document.getElementById("mixolydianButton").classList.add('active');
        qualityNR = 4;
    }
    if (document.getElementById("ionianButton").classList.contains('active')) document.getElementById("ionianButton").classList.remove('active');
    if (document.getElementById("dorianButton").classList.contains('active')) document.getElementById("dorianButton").classList.remove('active');
    if (document.getElementById("phrygianButton").classList.contains('active')) document.getElementById("phrygianButton").classList.remove('active');
    if (document.getElementById("lydianButton").classList.contains('active')) document.getElementById("lydianButton").classList.remove('active');
    if (document.getElementById("aeolianButton").classList.contains('active')) document.getElementById("aeolianButton").classList.remove('active');
    if (document.getElementById("locrianButton").classList.contains('active')) document.getElementById("locrianButton").classList.remove('active');
}
function clickAeolian(){
    if(document.getElementById("aeolianButton").classList.contains('active')){
        document.getElementById("aeolianButton").classList.remove('active');
        qualityNR = -1;
    }else{
        document.getElementById("aeolianButton").classList.add('active');
        qualityNR = 4;
    }
    if(document.getElementById("ionianButton").classList.contains('active')) document.getElementById("ionianButton").classList.remove('active');
    if(document.getElementById("dorianButton").classList.contains('active')) document.getElementById("dorianButton").classList.remove('active');
    if(document.getElementById("phrygianButton").classList.contains('active')) document.getElementById("phrygianButton").classList.remove('active');
    if(document.getElementById("lydianButton").classList.contains('active')) document.getElementById("lydianButton").classList.remove('active');
    if(document.getElementById("mixolydianButton").classList.contains('active')) document.getElementById("mixolydianButton").classList.remove('active');
    if(document.getElementById("locrianButton").classList.contains('active')) document.getElementById("locrianButton").classList.remove('active');
}
function clickLocrian(){
    if(document.getElementById("locrianButton").classList.contains('active')){
        document.getElementById("locrianButton").classList.remove('active');
        qualityNR = -1;
    }else{
        document.getElementById("locrianButton").classList.add('active');
        qualityNR = 4;
    }
    if(document.getElementById("ionianButton").classList.contains('active')) document.getElementById("ionianButton").classList.remove('active');
    if(document.getElementById("dorianButton").classList.contains('active')) document.getElementById("dorianButton").classList.remove('active');
    if(document.getElementById("phrygianButton").classList.contains('active')) document.getElementById("phrygianButton").classList.remove('active');
    if(document.getElementById("lydianButton").classList.contains('active')) document.getElementById("lydianButton").classList.remove('active');
    if(document.getElementById("mixolydianButton").classList.contains('active')) document.getElementById("mixolydianButton").classList.remove('active');
    if(document.getElementById("aeolianButton").classList.contains('active')) document.getElementById("aeolianButton").classList.remove('active');
}

function clickPreset(){
    if(!preset){
        document.getElementById("genome").value = 'GGGAGGCCCACGTATGGCGCCTCTCCAAAGGCTGCAGAAGTTTCTTGCTAACAAAAAGTCCGCACATTCGAGCAAAGACAGGCTTTAGCGAGTTATTAAAAACTTAGGGGCGCTCTTGTCCCCCACAGGGCCCGACCGCACACAGCAAGGCGATGGCCCAGCTGTAAGTTGGTAGCACTGAGAACTAGCAGCGCGCGCGGAGCCCGCTGAGACTTGAATCAATCTGGTCTAACGGTTTCCCCTAAACCGCTAGGAGCCCTCAATCGGCGGGACAGCAGGGCGCGTCCTCTGCCACTCTCGCTCCGAGGTCCCCGCGCCAGAGACGCAGCCGCGCTCCCACCACCCACACCCACCGCGCCCTCGTTCGCCTCTTCTCCGGGAGCCAGTCCGCGCCACCGCCGCCGCCCAGGCCATCGCCACCCTCCGCAGCCATGTCCACCAGGTCCGTGTCCTCGTCCTCCTACCGCAGGATGTTCGGCGGCCCGGGCACCGCGAGCCGGCCGAGCTCCAGCCGGAGCTACGTGACTACGTCCACCCGCACCTACAGCCTGGGCAGCGCGCTGCGCCCCAGCACCAGCCGCAGCCTCTACGCCTCGTCCCCGGGCGGCGTGTATGCCACGCGCTCCTCTGCCGTGCGCCTGCGGAGCAGCGTGCCCGGGGTGCGGCTCCTGCAGGACTCGGTGGACTTCTCGCTGGCCGACGCCATCAACACCGAGTTCAAGAACACCCGCACCAACGAGAAGGTGGAGCTGCAGGAGCTGAATGACCGCTTCGCCAACTACATCGACAAGGTGCGCTTCCTGGAGCAGCAGAATAAGATCCTGCTGGCCGAGCTCGAGCAGCTCAAGGGCCAAGGCAAGTCGCGCCTGGGGGACCTCTACGAGGAGGAGATGCGGGAGCTGCGCCGGCAGGTGGACCAGCTAACCAACGACAAAGCCCGCGTCGAGGTGGAGCGCGACAACCTGGCCGAGGACATCATGCGCCTCCGGGAGAAATTGCAGGAGGAGATGCTTCAGAGAGAGGAAGCCGAAAACACCCTGCAATCTTTCAGACAGGATGTTGACAATGCGTCTCTGGCACGTCTTGACCTTGAACGCAAAGTGGAATCTTTGCAAGAAGAGATTGCCTTTTTGAAGAAACTCCACGAAGAGGAAATCCAGGAGCTGCAGGCTCAGATTCAGGAACAGCATGTCCAAATCGATGTGGATGTTTCCAAGCCTGACCTCACGGCTGCCCTGCGTGACGTACGTCAGCAATATGAAAGTGTGGCTGCCAAGAACCTGCAGGAGGCAGAAGAATGGTACAAATCCAAGTTTGCTGACCTCTCTGAGGCTGCCAACCGGAACAATGACGCCCTGCGCCAGGCAAAGCAGGAGTCCACTGAGTACCGGAGACAGGTGCAGTCCCTCACCTGTGAAGTGGATGCCCTTAAAGGAACCAATGAGTCCCTGGAACGCCAGATGCGTGAAATGGAAGAGAACTTTGCCGTTGAAGCTGCTAACTACCAAGACACTATTGGCCGCCTGCAGGATGAGATTCAGAATATGAAGGAGGAAATGGCTCGTCACCTTCGTGAATACCAAGACCTGCTCAATGTTAAGATGGCCCTTGACATTATTGCCACCTACAGGAAGCTGCTGGAAGGCGAGGAGAGCAGGATTTCTCTGCCTCTTCCAAACTTTTCCTCCCTGAACCTGAGGGAAACTAATCTGGATTCACTCCCTCTGGTTGATACCCACTCAAAAAGGACACTTCTGATTAAGACGGTTGAAACTAGAGATGGACAGGTTATCAACGAAACTTCTCAGCATCACGATGACCTTGAATAAAAATTGCACACACTCAGTGCAGCAATATATTACCAGCAAGAATAAAAAAGAAATCCATATCTTAAAGAAACAGCTTTCAAGTGCCTTTCTGCAGTTTTTCAGGAGCGCAAGATAGATTTGGAATAGGAATAAGCTCTAGTTCTTAACAACCGACACTCCTACAAGATTTAGAAAAAAGTTTACAACATAATCTAGTTTACAGAAAAATCTTGTGCTAGAATACTTTTTAAAAGGTATTTTGAATACCATTAAAACTGCTTTTTTTTTTCCAGCAAGTATCCAACCAACTTGGTTCTGCTTCAATAAATCTTTGGAAAAACTC';
        document.getElementById("transposeKey").value = 0;
        document.getElementById("chordAmount").value = 4;
        document.getElementById("stepLength").value = 32;
        document.getElementById("bpm").value = 80;

        qualityNR = -1;
        if(document.getElementById("ionianButton").classList.contains('active')) document.getElementById("ionianButton").classList.remove('active');
        if(document.getElementById("dorianButton").classList.contains('active')) document.getElementById("dorianButton").classList.remove('active');
        if(document.getElementById("phrygianButton").classList.contains('active')) document.getElementById("phrygianButton").classList.remove('active');
        if(document.getElementById("lydianButton").classList.contains('active')) document.getElementById("lydianButton").classList.remove('active');
        if(document.getElementById("mixolydianButton").classList.contains('active')) document.getElementById("mixolydianButton").classList.remove('active');
        if(document.getElementById("aeolianButton").classList.contains('active')) document.getElementById("aeolianButton").classList.remove('active');
        if(document.getElementById("locrianButton").classList.contains('active')) document.getElementById("locrianButton").classList.remove('active');

        areChords = true;
        if(!document.getElementById("chordsButton").classList.contains('active')){
            document.getElementById("chordsButton").classList.add('active');
        }
        preset = true;
    }else{
        document.getElementById("genome").value = '';
        document.getElementById("transposeKey").value = 0;
        document.getElementById("chordAmount").value = 2;
        document.getElementById("stepLength").value = '';
        document.getElementById("bpm").value = '';

        qualityNR = -1;
        if(document.getElementById("ionianButton").classList.contains('active')) document.getElementById("ionianButton").classList.remove('active');
        if(document.getElementById("dorianButton").classList.contains('active')) document.getElementById("dorianButton").classList.remove('active');
        if(document.getElementById("phrygianButton").classList.contains('active')) document.getElementById("phrygianButton").classList.remove('active');
        if(document.getElementById("lydianButton").classList.contains('active')) document.getElementById("lydianButton").classList.remove('active');
        if(document.getElementById("mixolydianButton").classList.contains('active')) document.getElementById("mixolydianButton").classList.remove('active');
        if(document.getElementById("aeolianButton").classList.contains('active')) document.getElementById("aeolianButton").classList.remove('active');
        if(document.getElementById("locrianButton").classList.contains('active')) document.getElementById("locrianButton").classList.remove('active');

        areChords = false;
        if(document.getElementById("chordsButton").classList.contains('active')) document.getElementById("chordsButton").classList.remove('active');
        preset = false;
    }


}