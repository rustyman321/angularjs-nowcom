import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http'; 
import { trigger, style, transition, animate, keyframes, query, stagger } from '@angular/animations';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [
  	trigger('picsanimate', [
  		transition('* => *', [
  			query(':enter', style({ opacity: 0}), {optional:true}),

  			query(':enter', stagger('1000ms',[
  				animate('1s ease-in', keyframes([
  					style({opacity: 0, transform: 'translateX(-90%)', offset:0}),
  					style({opacity: 0.5, transform: 'translateX(50px)', offset:.3}),
  					style({opacity: 1, transform: 'translateX(0)', offset:1}),
  			]))]), {optional: true})
  		])
  	])
  ]
})

export class HomeComponent implements OnInit {
	btntxt: string = 'Search Image';
	apiUrl: string = 'https://api.flickr.com/services/rest';
	perPage: string = '4';
	page: number = 1;
	response: any = [];
	searchTxt: string;
  fail: string;
  loader: boolean = false;
  containerResponse: boolean = true;
  maxPage: number;
  storedStr: string;

  	constructor(private httpclient: HttpClient) { }

  	ngOnInit() {
  	}

    searchImage() {
      this.response = [];
      this.containerResponse = false;
      this.page = 1;
      this.flickrSearch(1);
    }

  	flickrSearch(page = 1) {
      this.loader = true;
      
  		this.httpclient.get(this.apiUrl,
  		{
  			params: {
  				method: 'flickr.photos.search',
  				api_key: 'f15e80a91b9085ee439ce0be391fc09c',
  				text: this.searchTxt,
  				page: ''+ page,
  				per_page: this.perPage,
          sort: 'relevance',
  				format: 'json',
  				nojsoncallback: '1'
  			},
  			responseType: 'json'
  		})
  		.subscribe(
  			(data:any) => {
          this.storedStr = this.searchTxt;
          this.maxPage = data.photos.pages;
          if(data.photos.photo.length > 0){
            this.fail = '';
            this.response.push(data.photos.photo);
          }else if(data.photos.photo.length < 1 && this.maxPage < 1){
            this.fail = "No Image(s) found";
          }
          this.loader = false;
          this.containerResponse = true;
  			},
  			error => {
  				console.log(error);
  				this.fail = "No Image(s) found";
          this.loader = false;
          this.containerResponse = true;
  			}
  		)
	}

  onScrollload() {
    if(this.response.length > 0){
      this.page++;
      this.flickrSearch(this.page);
    }
  }
}
