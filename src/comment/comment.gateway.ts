import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets'

@WebSocketGateway()
export class CommentGateway {
  @WebSocketServer()
  server

  @SubscribeMessage('createComment')
  handleMessage(@MessageBody() message: string) {
    this.server.emit('commentCreated', message)
  }
}
