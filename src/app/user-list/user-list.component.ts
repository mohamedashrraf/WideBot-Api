import { Component } from '@angular/core';
import { UserService } from '../services/user.service';
import { BehaviorSubject } from 'rxjs';
import { LoaderComponent } from "../loader/loader.component";
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [LoaderComponent, HttpClientModule],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss'
})
export class UserListComponent {

  users: any[] = [];
  paginatedUsers: any[] = [];
  isLoading = true;
  searchQuery = '';
  currentPage = 1;
  itemsPerPage = 5;
  totalPages = 0;
  pages: number[] = [];
  private userSubject = new BehaviorSubject<any[]>([]);

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit() {
    this.userService.getUsers().subscribe((users) => {
      this.users = users;
      this.userSubject.next(users);
      this.totalPages = Math.ceil(users.length / this.itemsPerPage);
      this.setPage(1);
      this.isLoading = false;
    });
  }

  setPage(page: number) {
    this.currentPage = page;
    const startIndex = (page - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedUsers = this.userSubject.value.slice(startIndex, endIndex);
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.setPage(this.currentPage - 1);
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.setPage(this.currentPage + 1);
    }
  }

onSearch(event: Event) {
  const target = event.target as HTMLInputElement;
  const query = target.value.toLowerCase();
  this.searchQuery = query;
  const filteredUsers = this.users.filter(user =>
    user.name.toLowerCase().includes(this.searchQuery) ||
    user.username.toLowerCase().includes(this.searchQuery)
  );
  this.userSubject.next(filteredUsers);
  this.totalPages = Math.ceil(filteredUsers.length / this.itemsPerPage);
  this.setPage(1);
}


  sort(field: string) {
    const sortedUsers = [...this.userSubject.value].sort((a, b) => {
      if (a[field] < b[field]) return -1;
      if (a[field] > b[field]) return 1;
      return 0;
    });
    this.userSubject.next(sortedUsers);
    this.setPage(this.currentPage);
  }

  viewUser(id: number): void {
    this.router.navigate(['/user', id]);
  }
}

