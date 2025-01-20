const sendStreams = (peer, stream) => {
    console.log('Attempting to send stream:', stream);
    if (!stream) {
        console.error("No stream available to send");
        return;
    }

    const senders = peer.getSenders();
    console.log('Existing senders:', senders);
    const tracks = stream.getTracks();

    tracks.forEach((track) => {
        const existingSender = senders.find((sender) => sender.track === track);
        if (!existingSender) {
            console.log('Adding track:', track);
            peer.addTrack(track, stream);
        } else {
            console.log('Track already added:', track);
        }
    });
};


export default sendStreams;
