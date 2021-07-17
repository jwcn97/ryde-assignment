select * from add_user($${
  "name": "user"
}$$);

select * from update_user(1, $${
  "name": "test",
  "latitude": 0.87,
  "longitude": 0.87
}$$);

select * from add_user($${
  "name": "friend1",
  "latitude": 0.87,
  "longitude": 0.87
}$$);

select * from add_user($${
  "name": "friend2",
  "latitude": 0.87,
  "longitude": 0.87
}$$);

select * from add_user($${
  "name": "friend3",
  "latitude": 0.87,
  "longitude": 0.87
}$$);

select * from add_user($${
  "name": "friend4",
  "latitude": 0.87,
  "longitude": 1000
}$$);