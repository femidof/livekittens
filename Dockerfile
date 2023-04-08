FROM golang:1.19

WORKDIR /usr/src/app

COPY . .

RUN go mod tidy

RUN go build -v -o /usr/local/bin/app ./...

EXPOSE 8080:8080

CMD ["app"]