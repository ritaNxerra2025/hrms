import { ApiProperty } from '@nestjs/swagger';

class TokenUserDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 1 })
  tenantId: number;

  @ApiProperty({ example: 'superadmin@nxerra.com' })
  email: string;

  @ApiProperty({ example: 'Super' })
  fullName: string;


}

export class AuthTokensResponse {
  @ApiProperty({ description: 'Short-lived access token' })
  accessToken: string;

  @ApiProperty({ description: 'Long-lived refresh token' })
  refreshToken: string;

  @ApiProperty({ example: 'Bearer' })
  tokenType: string;

  @ApiProperty({ example: '15m' })
  expiresIn: string;

  @ApiProperty({ type: TokenUserDto })
  user: TokenUserDto;

  @ApiProperty({ type: [String], example: ['user:view', 'role:view'] })
  permissions: string[];
}
