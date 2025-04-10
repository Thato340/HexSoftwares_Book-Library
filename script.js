document.addEventListener('DOMContentLoaded', function() {
    
    let books = [
        {
            id: 1,
            title: "The Great Gatsby",
            author: "F. Scott Fitzgerald",
            category: "fiction",
            status: "read",
            rating: 4
        },
        {
            id: 2,
            title: "Sapiens: A Brief History of Humankind",
            author: "Yuval Noah Harari",
            category: "non-fiction",
            status: "reading",
            rating: 5
        },
        {
            id: 3,
            title: "Harry Potter and the Philosopher's Stone",
            author: "J.K. Rowling",
            category: "fantasy",
            status: "read",
            rating: 5
        },
        {
            id: 4,
            title: "Dune",
            author: "Frank Herbert",
            category: "sci-fi",
            status: "unread",
            rating: 0
        }
    ];

    
    const bookList = document.getElementById('bookList');
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const addBookBtn = document.getElementById('addBookBtn');
    const addBookModal = document.getElementById('addBookModal');
    const closeModal = document.querySelector('.close');
    const bookForm = document.getElementById('bookForm');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const totalBooksEl = document.getElementById('totalBooks');
    const booksReadEl = document.getElementById('booksRead');
    const readingNowEl = document.getElementById('readingNow');
    const ratingStars = document.querySelectorAll('.rating-stars i');

    
    function displayBooks(booksToDisplay = books) {
        bookList.innerHTML = '';
        
        if (booksToDisplay.length === 0) {
            bookList.innerHTML = '<p class="no-books">No books found. Try adding some!</p>';
            return;
        }
        
        booksToDisplay.forEach(book => {
            const bookCard = document.createElement('div');
            bookCard.className = 'book-card';
            
            
            let starsHtml = '';
            for (let i = 1; i <= 5; i++) {
                if (i <= book.rating) {
                    starsHtml += '<i class="fas fa-star"></i>';
                } else {
                    starsHtml += '<i class="far fa-star"></i>';
                }
            }
            
            bookCard.innerHTML = `
                <span class="status ${book.status}">${book.status.replace('-', ' ')}</span>
                <h3>${book.title}</h3>
                <p class="author">by ${book.author}</p>
                <span class="category">${book.category.replace('-', ' ')}</span>
                <div class="rating">${starsHtml}</div>
                <div class="actions">
                    <button class="edit" data-id="${book.id}"><i class="fas fa-edit"></i> Edit</button>
                    <button class="delete" data-id="${book.id}"><i class="fas fa-trash"></i> Delete</button>
                </div>
            `;
            
            bookList.appendChild(bookCard);
        });
        
        updateStats();
        
        
        document.querySelectorAll('.edit').forEach(btn => {
            btn.addEventListener('click', (e) => editBook(e.target.dataset.id));
        });
        
        document.querySelectorAll('.delete').forEach(btn => {
            btn.addEventListener('click', (e) => deleteBook(e.target.dataset.id));
        });
    }

    
    function updateStats() {
        totalBooksEl.textContent = books.length;
        booksReadEl.textContent = books.filter(book => book.status === 'read').length;
        readingNowEl.textContent = books.filter(book => book.status === 'reading').length;
    }

    
    function searchBooks() {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredBooks = books.filter(book => 
            book.title.toLowerCase().includes(searchTerm) || 
            book.author.toLowerCase().includes(searchTerm)
        );
        displayBooks(filteredBooks);
    }

    
    function filterBooks(category) {
        if (category === 'all') {
            displayBooks();
            return;
        }
        
        const filteredBooks = books.filter(book => book.category === category);
        displayBooks(filteredBooks);
    }

    
    function addBook(e) {
        e.preventDefault();
        
        const title = document.getElementById('title').value;
        const author = document.getElementById('author').value;
        const category = document.getElementById('category').value;
        const status = document.getElementById('status').value;
        const rating = parseInt(document.getElementById('rating').value);
        
        const newBook = {
            id: Date.now(), 
            title,
            author,
            category,
            status,
            rating
        };
        
        books.push(newBook);
        displayBooks();
        closeModal.click();
        bookForm.reset();
        resetRatingStars();
    }

    
    function editBook(id) {
        const book = books.find(book => book.id == id);
        if (!book) return;
        
        
        document.getElementById('title').value = book.title;
        document.getElementById('author').value = book.author;
        document.getElementById('category').value = book.category;
        document.getElementById('status').value = book.status;
        document.getElementById('rating').value = book.rating;
        
        
        resetRatingStars();
        for (let i = 0; i < book.rating; i++) {
            ratingStars[i].classList.add('active');
            ratingStars[i].classList.remove('far');
            ratingStars[i].classList.add('fas');
        }
        
        
        bookForm.dataset.editId = id;
        document.querySelector('.modal-content h2').textContent = 'Edit Book';
        document.querySelector('#bookForm button').textContent = 'Update Book';
        
        addBookModal.style.display = 'block';
    }


    function deleteBook(id) {
        if (confirm('Are you sure you want to delete this book?')) {
            books = books.filter(book => book.id != id);
            displayBooks();
        }
    }

    
    function resetRatingStars() {
        ratingStars.forEach(star => {
            star.classList.remove('active', 'fas');
            star.classList.add('far');
        });
        document.getElementById('rating').value = 0;
    }

    
    searchBtn.addEventListener('click', searchBooks);
    searchInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') searchBooks();
    });

    addBookBtn.addEventListener('click', () => {
        bookForm.reset();
        resetRatingStars();
        bookForm.removeAttribute('data-edit-id');
        document.querySelector('.modal-content h2').textContent = 'Add a New Book';
        document.querySelector('#bookForm button').textContent = 'Add Book';
        addBookModal.style.display = 'block';
    });

    closeModal.addEventListener('click', () => {
        addBookModal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === addBookModal) {
            addBookModal.style.display = 'none';
        }
    });

    bookForm.addEventListener('submit', function(e) {
        if (this.dataset.editId) {
            
            const id = parseInt(this.dataset.editId);
            const bookIndex = books.findIndex(book => book.id === id);
            
            if (bookIndex !== -1) {
                books[bookIndex] = {
                    id,
                    title: document.getElementById('title').value,
                    author: document.getElementById('author').value,
                    category: document.getElementById('category').value,
                    status: document.getElementById('status').value,
                    rating: parseInt(document.getElementById('rating').value)
                };
                
                displayBooks();
                closeModal.click();
            }
        } else {
            
            addBook(e);
        }
    });

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            filterBooks(button.dataset.filter);
        });
    });

    
    ratingStars.forEach(star => {
        star.addEventListener('click', () => {
            const rating = parseInt(star.dataset.rating);
            document.getElementById('rating').value = rating;
            
            resetRatingStars();
            for (let i = 0; i < rating; i++) {
                ratingStars[i].classList.add('active', 'fas');
                ratingStars[i].classList.remove('far');
            }
        });
        
        star.addEventListener('mouseover', () => {
            const rating = parseInt(star.dataset.rating);
            
            resetRatingStars();
            for (let i = 0; i < rating; i++) {
                ratingStars[i].classList.add('active');
            }
        });
        
        star.addEventListener('mouseout', () => {
            const currentRating = parseInt(document.getElementById('rating').value);
            
            resetRatingStars();
            for (let i = 0; i < currentRating; i++) {
                ratingStars[i].classList.add('active', 'fas');
                ratingStars[i].classList.remove('far');
            }
        });
    });

    // Initial display
    displayBooks();
});