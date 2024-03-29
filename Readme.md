<div align="center">
    <h1>transaction-API</h1>
</div>

## Todo

- RF

  - [x] O usuário deve poder criar uma nova transação;
  - [x] O usuário deve poder obter um resumo da sua conta;
  - [x] O usuário deve poder listar todas transações que já ocorreram;
  - [x] O usuário deve poder visualizar uma transação única;
  - [x] O usuário deve poder editar uma transação;
  - [x] O usuário deve poder deletar uma transação;

- RN

  - [x] A transação pode ser do tipo crédito que domará ao valor total, ou débito subtrairá;
  - [x] Deve ser possível identificarmos o usuário entre as requisições;
  - [x] O usuário só pode visualizar transações o qual ele criou;

- RNF

## Routes

```bash
  # Create transaction
  POST http://localhost:3333/transactions
  body: {
    "title": "New Transaction",
    "amount": 166,
    "type": "debit", # | "credit"
  }

  # Return
  201 Created
```

```bash
  # List all transactions
  GET http://localhost:3333/transactions

  # params
   page?: string , default '1'
   perPage?: string, default '10'

  # Return
  {
    "transactions": [
      {
        "id": "8d9d39ee-1b2b-450a-bb0f-00c319b8d06b",
        "title": "New Transaction",
        "amount": -166,
        "created_at": "2024-03-29 16:42:13",
        "session_id": "9ffc88a7-3cce-4d4b-93d2-2fe7c7c733bd"
      }
    ],
    "currentPage": 1,
    "totalPages": 1,
    "totalTransactions": 1,
    "perPage": 10
  }
```

```bash
  # Summary transaction
  GET http://localhost:3333/transactions/summary

  # Return
  {
    "summary": {
      "amount": -166
    }
  }
```

```bash
  # Delete transaction
  DELETE  http://localhost:3333/transactions/:id

  # Return
  204 No Content
```

```bash
  # Get detail transaction
  GET  http://localhost:3333/transactions/:id

  # Return
  {
    "transaction": {
      "id": "8d9d39ee-1b2b-450a-bb0f-00c319b8d06b",
      "title": "New Transaction",
      "amount": -166,
      "created_at": "2024-03-29 16:42:13",
      "session_id": "9ffc88a7-3cce-4d4b-93d2-2fe7c7c733bd"
    }
  }
```

```bash
  # Update transaction
  PUT  http://localhost:3333/transactions/:id

  body: {
    "title"?: "New Transaction",
    "amount"?: 166,
    "type"?: "debit",
  }

  # Return
  204 No Content
```
