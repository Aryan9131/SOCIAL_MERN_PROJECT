import { setOtherPersonStream } from "../features/streamingSlice";

class PeerService {
    constructor() {
        if (!this.peer) {
            this.peer = new RTCPeerConnection({
                iceServers: [
                    {
                        urls: [
                            'stun:stun.l.google.com:19302',
                            'stun:global.stun.twilio.com:3478',
                        ],
                    },
                ],
            });
             // Handle incoming tracks
           this.peer.ontrack = (event) => {
            console.log('Track received: ', event.streams[0]);
              // Dispatch the received stream to Redux store
              if (this.dispatch) {
                console.log(' sending stream to otherPersonStream')
                this.dispatch(setOtherPersonStream({otherPersonStream : event.streams[0]})); // Use your Redux action here
            }
          };
            this.isNegotiating = false; // Guard for SDP negotiation
        }
    }
    setReduxDispatch(dispatch) {
        this.dispatch = dispatch; // Save the Redux dispatch function
    }
    stopConnection(){
        console.log('stopConnection() called !')
        this.peer= undefined;
    }
    async getOffer() {
        if (this.peer && !this.isNegotiating) {
            try {
                this.isNegotiating = true; // Lock negotiation
                const offer = await this.peer.createOffer();
                await this.peer.setLocalDescription(offer);
                return offer;
            } catch (error) {
                console.error('Error in getOffer:', error);
            } finally {
                this.isNegotiating = false; // Unlock negotiation
            }
        }
    }

    async getAnswer(offer) {
        try {
            await this.peer.setRemoteDescription(new RTCSessionDescription(offer));
            const answer = await this.peer.createAnswer();
            await this.peer.setLocalDescription(answer);
            return answer;
        } catch (error) {
            console.error('Error in getAnswer:', error);
        }
    }

    async setRemoteDescription(ans) {
        if (this.peer) {
            try {
                await this.peer.setRemoteDescription(new RTCSessionDescription(ans));
            } catch (error) {
                console.error('Error in setRemoteDescription:', error);
            }
        }
    }
}

export default new PeerService();
