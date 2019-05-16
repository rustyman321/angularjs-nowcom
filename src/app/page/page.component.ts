import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http'; 

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss']
})
export class PageComponent implements OnInit {
  apiUrl: string = 'https://api.flickr.com/services/rest';
  id: string;
  fail: string;
  originalSize: number;
  imageSrc: string;
  imageDetails: any;

  constructor(private route: ActivatedRoute, private httpclient: HttpClient) {}

  ngOnInit() {
  	this.route.params.subscribe(res => this.id = res.id);
  	this.getImage(this.id);
  }

	getImage(id) {
  		this.httpclient.get(this.apiUrl,
  		{
  			params: {
  				method: 'flickr.photos.getSizes',
  				api_key: 'f15e80a91b9085ee439ce0be391fc09c',
  				photo_id: id,
  				format: 'json',
  				nojsoncallback: '1'
  			},
  			responseType: 'json'
  		})
  		.subscribe(
  			(data:any) => {
  				if(data.stat == 'fail'){
  					this.fail = data.message;
  				}else{
  					this.originalSize = data.sizes.size.length - 1;
  					this.imageSrc = data.sizes.size[this.originalSize].source;
  				}
  				this.getImageDetails(this.id);
  			},
  			error => {
  				console.log(error);
  				this.fail = "Something wen't wrong";
  			}
  		)
	}

	getImageDetails(id) {
  		this.httpclient.get(this.apiUrl,
  		{
  			params: {
  				method: 'flickr.photos.getInfo',
  				api_key: 'f15e80a91b9085ee439ce0be391fc09c',
  				photo_id: id,
  				format: 'json',
  				nojsoncallback: '1'
  			},
  			responseType: 'json'
  		})
  		.subscribe(
  			(data:any) => {
  				if(data.stat == 'fail'){
  					this.fail = data.message;
  				}else{
  					this.imageDetails = data.photo;
  				}
  				console.log(this.imageDetails);
  			},
  			error => {
  				console.log(error);
  				this.fail = "Something wen't wrong";
  			}
  		)
	}
}
