import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {
  users$: Object;
  userPostSubject$ = new BehaviorSubject(null);
  isActive = false;
  postComments$: Object;
  isFetching = false;
  userSelected: Object;
  postSelected: Object;
  initialPosts$ = new BehaviorSubject(null);

  constructor(private data: DataService) { }

  ngOnInit() {
    this.isFetching = true;
    this.data.getUsers().subscribe(
      (data: any) => {
        this.users$ = data;
        console.log('this.users$', this.users$);
        this.isFetching = false;
      }
    );

    this.data.getPosts().subscribe(
      (data: any) => {
        this.userPostSubject$.next(data);
        console.log('Behaviour Subject:', this.userPostSubject$);
      }
    );
  }

  getUserPosts(user: any) {
    this.userSelected = user;
    this.postComments$ = null;
    console.log('this.userSelected:', this.userSelected);
    this.userPostSubject$.subscribe(
      (data: any) => { 
        const upost = data.filter(item => item.userId === user.id);
        if(upost.length > 3) {
          this.initialPosts$.next(upost.slice(0, 3));
        } else {
          this.initialPosts$.next(upost);
        }
      }
    );
  }

  getUserAllPosts(selUser: any) {
    this.postComments$ = null;
    this.userPostSubject$.subscribe(
      (data: any) => { 
        const upost = data.filter(item => item.userId === selUser);
        console.log('3:',upost);
        this.initialPosts$.next(upost);
      }
    );
  }

  getPComments(post: any) {
    this.postSelected = post;
    this.isFetching = true;
    this.data.getPostComments(post.id).subscribe(
      (data: any) => {
        this.postComments$ = data;
        this.isFetching = false;
        console.log('this.postComments$', this.postComments$);
      }
    );
  }

}
