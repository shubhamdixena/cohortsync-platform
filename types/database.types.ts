export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      Announcement: {
        Row: {
          content: string
          createdAt: string
          createdById: string
          expiresAt: string | null
          id: string
          priority: Database["public"]["Enums"]["AnnouncementPriority"]
          publishedAt: string | null
          status: Database["public"]["Enums"]["AnnouncementStatus"]
          title: string
          updatedAt: string
          category: string | null
          targetAudience: string | null
          views: number
          reactions: number
        }
        Insert: {
          content: string
          createdAt?: string
          createdById: string
          expiresAt?: string | null
          id: string
          priority?: Database["public"]["Enums"]["AnnouncementPriority"]
          publishedAt?: string | null
          status?: Database["public"]["Enums"]["AnnouncementStatus"]
          title: string
          updatedAt: string
          category?: string | null
          targetAudience?: string | null
          views?: number
          reactions?: number
        }
        Update: {
          content?: string
          createdAt?: string
          createdById?: string
          expiresAt?: string | null
          id?: string
          priority?: Database["public"]["Enums"]["AnnouncementPriority"]
          publishedAt?: string | null
          status?: Database["public"]["Enums"]["AnnouncementStatus"]
          title?: string
          updatedAt?: string
          category?: string | null
          targetAudience?: string | null
          views?: number
          reactions?: number
        }
        Relationships: []
      }
      AuditLog: {
        Row: {
          action: string
          changes: string | null
          createdAt: string
          entityId: string
          entityType: string
          id: string
          userId: string
        }
        Insert: {
          action: string
          changes?: string | null
          createdAt?: string
          entityId: string
          entityType: string
          id: string
          userId: string
        }
        Update: {
          action?: string
          changes?: string | null
          createdAt?: string
          entityId?: string
          entityType?: string
          id?: string
          userId?: string
        }
        Relationships: []
      }
      Comment: {
        Row: {
          authorId: string
          content: string
          createdAt: string
          id: string
          likes: number
          postId: string
          updatedAt: string
        }
        Insert: {
          authorId: string
          content: string
          createdAt?: string
          id: string
          likes?: number
          postId: string
          updatedAt: string
        }
        Update: {
          authorId?: string
          content?: string
          createdAt?: string
          id?: string
          likes?: number
          postId?: string
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "Comment_authorId_fkey"
            columns: ["authorId"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Comment_postId_fkey"
            columns: ["postId"]
            isOneToOne: false
            referencedRelation: "Post"
            referencedColumns: ["id"]
          },
        ]
      }
      Conversation: {
        Row: {
          createdAt: string
          description: string | null
          id: string
          lastMessageAt: string | null
          name: string | null
          participantIds: string
          type: Database["public"]["Enums"]["ConversationType"]
          updatedAt: string
        }
        Insert: {
          createdAt?: string
          description?: string | null
          id: string
          lastMessageAt?: string | null
          name?: string | null
          participantIds: string
          type: Database["public"]["Enums"]["ConversationType"]
          updatedAt: string
        }
        Update: {
          createdAt?: string
          description?: string | null
          id?: string
          lastMessageAt?: string | null
          name?: string | null
          participantIds?: string
          type?: Database["public"]["Enums"]["ConversationType"]
          updatedAt?: string
        }
        Relationships: []
      }
      Message: {
        Row: {
          content: string
          conversationId: string
          createdAt: string
          id: string
          isRead: boolean
          readAt: string | null
          senderId: string
        }
        Insert: {
          content: string
          conversationId: string
          createdAt?: string
          id: string
          isRead?: boolean
          readAt?: string | null
          senderId: string
        }
        Update: {
          content?: string
          conversationId?: string
          createdAt?: string
          id?: string
          isRead?: boolean
          readAt?: string | null
          senderId?: string
        }
        Relationships: [
          {
            foreignKeyName: "Message_conversationId_fkey"
            columns: ["conversationId"]
            isOneToOne: false
            referencedRelation: "Conversation"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Message_senderId_fkey"
            columns: ["senderId"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["id"]
          },
        ]
      }
      ModeratedContent: {
        Row: {
          actionTaken: string | null
          contentId: string
          contentType: string
          createdAt: string
          description: string | null
          id: string
          reason: string
          reportedBy: string
          status: Database["public"]["Enums"]["ReportStatus"]
          updatedAt: string
        }
        Insert: {
          actionTaken?: string | null
          contentId: string
          contentType: string
          createdAt?: string
          description?: string | null
          id: string
          reason: string
          reportedBy: string
          status?: Database["public"]["Enums"]["ReportStatus"]
          updatedAt: string
        }
        Update: {
          actionTaken?: string | null
          contentId?: string
          contentType?: string
          createdAt?: string
          description?: string | null
          id?: string
          reason?: string
          reportedBy?: string
          status?: Database["public"]["Enums"]["ReportStatus"]
          updatedAt?: string
        }
        Relationships: []
      }
      Post: {
        Row: {
          authorId: string
          category: string | null
          content: string
          createdAt: string
          id: string
          image: string | null
          likes: number
          tags: string | null
          updatedAt: string
        }
        Insert: {
          authorId: string
          category?: string | null
          content: string
          createdAt?: string
          id: string
          image?: string | null
          likes?: number
          tags?: string | null
          updatedAt: string
        }
        Update: {
          authorId?: string
          category?: string | null
          content?: string
          createdAt?: string
          id?: string
          image?: string | null
          likes?: number
          tags?: string | null
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "Post_authorId_fkey"
            columns: ["authorId"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["id"]
          },
        ]
      }
      Profile: {
        Row: {
          bio: string | null
          cohort: string | null
          education: string | null
          experience: string | null
          expertise: string | null
          github: string | null
          id: string
          joinedDate: string | null
          linkedin: string | null
          lookingFor: string | null
          offering: string | null
          phone: string | null
          skills: string | null
          title: string | null
          twitter: string | null
          updatedAt: string
          userId: string
          website: string | null
        }
        Insert: {
          bio?: string | null
          cohort?: string | null
          education?: string | null
          experience?: string | null
          expertise?: string | null
          github?: string | null
          id: string
          joinedDate?: string | null
          linkedin?: string | null
          lookingFor?: string | null
          offering?: string | null
          phone?: string | null
          skills?: string | null
          title?: string | null
          twitter?: string | null
          updatedAt: string
          userId: string
          website?: string | null
        }
        Update: {
          bio?: string | null
          cohort?: string | null
          education?: string | null
          experience?: string | null
          expertise?: string | null
          github?: string | null
          id?: string
          joinedDate?: string | null
          linkedin?: string | null
          lookingFor?: string | null
          offering?: string | null
          phone?: string | null
          skills?: string | null
          title?: string | null
          twitter?: string | null
          updatedAt?: string
          userId?: string
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "Profile_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["id"]
          },
        ]
      }
      Resource: {
        Row: {
          accessLevel: Database["public"]["Enums"]["AccessLevel"]
          category: string
          createdAt: string
          description: string | null
          downloads: number
          featured: boolean
          fileSize: number | null
          fileUrl: string | null
          id: string
          tags: string | null
          title: string
          type: string
          updatedAt: string
          uploadedById: string
          url: string | null
        }
        Insert: {
          accessLevel?: Database["public"]["Enums"]["AccessLevel"]
          category: string
          createdAt?: string
          description?: string | null
          downloads?: number
          featured?: boolean
          fileSize?: number | null
          fileUrl?: string | null
          id: string
          tags?: string | null
          title: string
          type: string
          updatedAt: string
          uploadedById: string
          url?: string | null
        }
        Update: {
          accessLevel?: Database["public"]["Enums"]["AccessLevel"]
          category?: string
          createdAt?: string
          description?: string | null
          downloads?: number
          featured?: boolean
          fileSize?: number | null
          fileUrl?: string | null
          id?: string
          tags?: string | null
          title?: string
          type?: string
          updatedAt?: string
          uploadedById?: string
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "Resource_uploadedById_fkey"
            columns: ["uploadedById"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["id"]
          },
        ]
      }
      Subgroup: {
        Row: {
          color: string | null
          createdAt: string
          description: string | null
          icon: string | null
          id: string
          moderators: string | null
          name: string
          type: string
          updatedAt: string
          category: string | null
          image: string | null
          location: string | null
          isActive: boolean
          tags: string | null
        }
        Insert: {
          color?: string | null
          createdAt?: string
          description?: string | null
          icon?: string | null
          id: string
          moderators?: string | null
          name: string
          type: string
          updatedAt: string
          category?: string | null
          image?: string | null
          location?: string | null
          isActive?: boolean
          tags?: string | null
        }
        Update: {
          color?: string | null
          createdAt?: string
          description?: string | null
          icon?: string | null
          id?: string
          moderators?: string | null
          name?: string
          type?: string
          updatedAt?: string
          category?: string | null
          image?: string | null
          location?: string | null
          isActive?: boolean
          tags?: string | null
        }
        Relationships: []
      }
      SubgroupMember: {
        Row: {
          id: string
          joinedAt: string
          role: Database["public"]["Enums"]["SubgroupRole"]
          subgroupId: string
          userId: string
        }
        Insert: {
          id: string
          joinedAt?: string
          role?: Database["public"]["Enums"]["SubgroupRole"]
          subgroupId: string
          userId: string
        }
        Update: {
          id?: string
          joinedAt?: string
          role?: Database["public"]["Enums"]["SubgroupRole"]
          subgroupId?: string
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "SubgroupMember_subgroupId_fkey"
            columns: ["subgroupId"]
            isOneToOne: false
            referencedRelation: "Subgroup"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "SubgroupMember_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["id"]
          },
        ]
      }
      User: {
        Row: {
          avatar: string | null
          bio: string | null
          createdAt: string
          email: string
          id: string
          initials: string
          location: string | null
          name: string
          password: string
          phone: string | null
          role: Database["public"]["Enums"]["UserRole"]
          status: Database["public"]["Enums"]["MemberStatus"]
          updatedAt: string
        }
        Insert: {
          avatar?: string | null
          bio?: string | null
          createdAt?: string
          email: string
          id: string
          initials: string
          location?: string | null
          name: string
          password: string
          phone?: string | null
          role?: Database["public"]["Enums"]["UserRole"]
          status?: Database["public"]["Enums"]["MemberStatus"]
          updatedAt: string
        }
        Update: {
          avatar?: string | null
          bio?: string | null
          createdAt?: string
          email?: string
          id?: string
          initials?: string
          location?: string | null
          name?: string
          password?: string
          phone?: string | null
          role?: Database["public"]["Enums"]["UserRole"]
          status?: Database["public"]["Enums"]["MemberStatus"]
          updatedAt?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      AccessLevel: "PUBLIC" | "MEMBERS_ONLY" | "ADMIN_ONLY"
      AnnouncementPriority: "LOW" | "NORMAL" | "HIGH" | "URGENT"
      AnnouncementStatus: "DRAFT" | "PUBLISHED" | "ARCHIVED"
      ConversationType: "DIRECT" | "GROUP"
      MemberStatus: "ACTIVE" | "PENDING" | "SUSPENDED" | "INACTIVE"
      ReportStatus: "PENDING" | "REVIEWING" | "RESOLVED" | "DISMISSED"
      SubgroupRole: "MEMBER" | "MODERATOR"
      UserRole: "MEMBER" | "ADMIN"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      AccessLevel: ["PUBLIC", "MEMBERS_ONLY", "ADMIN_ONLY"],
      AnnouncementPriority: ["LOW", "NORMAL", "HIGH", "URGENT"],
      AnnouncementStatus: ["DRAFT", "PUBLISHED", "ARCHIVED"],
      ConversationType: ["DIRECT", "GROUP"],
      MemberStatus: ["ACTIVE", "PENDING", "SUSPENDED", "INACTIVE"],
      ReportStatus: ["PENDING", "REVIEWING", "RESOLVED", "DISMISSED"],
      SubgroupRole: ["MEMBER", "MODERATOR"],
      UserRole: ["MEMBER", "ADMIN"],
    },
  },
} as const
