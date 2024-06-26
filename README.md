# ECommerce Project

This is a Django based project managed with Poetry that represents E-Commerce application.

## Prerequisites

Before you get started, make sure you have the following installed:

- Python (3.6 or higher)
- Poetry (you can install it using pip: `pip install poetry`)

## Installation

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/Abdelfattah27/FrandzE-Commerce
   cd FrandzE-Commerce/Backend

2. **Initialize Poetry:**

```bash
poetry init

```

Follow the prompts to configure your Poetry project.

3. **Install Dependencies:**

Use Poetry to install the project's dependencies:

```bash
poetry install
```

4. **Create the Database:**

Before you can create a superuser, apply the initial migrations and create the database:

```bash
poetry run python manage.py migrate
```


5. **Create a Superuser:**

To create a superuser, use the following command and follow the prompts:

```bash
poetry run python manage.py createsuperuser
```

Run the Server:

```bash
poetry run python manage.py runserver
```
