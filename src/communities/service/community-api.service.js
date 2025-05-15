import axios from 'axios';
import { CommunityAssembler } from './community.assembler.js';

export class CommunityApiService {
    getCommunities() {
        return axios.get('https://livria-6efh.onrender.com/communities')
            .then(response => CommunityAssembler.toEntitiesFromResponse(response))
            .catch(error => {
                console.error('Error fetching books:', error);
                throw error;
            });
    }
    createCommunity(community) {
        return fetch('https://livria-6efh.onrender.com/communities', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(community)
        }).then(res => res.json())
    }
    updateCommunity(community) {
        return axios.put(`https://livria-6efh.onrender.com/communities/${community.id}`, community)
            .catch(error => {
                console.error('Error updating users:', error);
                throw error;
            });
    }

}