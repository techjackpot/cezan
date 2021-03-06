import React  from 'react';
import { connect } from 'react-redux';
import * as firebase from 'firebase';
import 'firebase/firestore';
import AudioPreviewTrackElement from './AudioPreviewTrackElement';

class AudioPreviewTracks extends React.Component {
	state = {
		// user: {...this.props.user, uid: firebase.auth().currentUser.uid},
		resume: this.props.resume,
		type: this.props.type,
		pageNumber: this.props.pageNumber,
		tracks: [],
		isPlayingTrack: null
	};

	componentWillMount() {
		this.listener = firebase.firestore().collection('resumes').doc(this.state.resume.resume_id).collection('tracks').onSnapshot((snapshot) => {
			let tracks = [];
		  snapshot.forEach((childSnapshot) => {
		    const childKey = childSnapshot.id;
		    const childData = childSnapshot.data();
		    if(childData.pageNumber === this.state.pageNumber && childData.step === 3) {
		    	tracks.push({...childData, track_id: childKey});
		    }
		  });
			this.setState({ loaded: true, tracks });
		});
	}

	componentWillUnmount() {
		this.listener && (this.listener)();
	}

	iamPlaying = (isPlayingTrack) => {
		this.setState({ isPlayingTrack });
	}

	render() {
		const { loaded, tracks, isPlayingTrack } = this.state;
		return (
			<div className="audio-preview-track-container">
				<div className="audio-preview-track-overlay"></div>
				{ loaded && tracks.map((track, idx) => <AudioPreviewTrackElement track={track} key={track.track_id} {...this.props} iamPlaying={this.iamPlaying} isPlayingTrack={isPlayingTrack === track.track_id} />) }
			</div>
		);
	}
}

export default connect(state=>({
	user: state.auth.user
}))(AudioPreviewTracks);
